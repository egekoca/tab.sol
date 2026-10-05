use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::TabError;
use crate::state::{AgentCredit, AgentStatus, Pool};

/// Temerrüt + slash waterfall (§8.7): now > due_at + grace olduğunda keeper
/// tetikler. Waterfall: 1) operatör bond 2) backer stake (v2) 3) senior LP.
#[derive(Accounts)]
pub struct MarkDefault<'info> {
    pub keeper: Signer<'info>,

    #[account(mut)]
    pub agent_credit: Account<'info, AgentCredit>,

    #[account(mut, seeds = [POOL_SEED], bump = pool.bump)]
    pub pool: Account<'info, Pool>,
    // NOT: tüm açık CreditChannel hesapları için requestClose CPI'si
    // remaining_accounts ile iterasyonla yapılacak (gün 1 spike sonrası).
}

pub fn handler(ctx: Context<MarkDefault>, now: i64) -> Result<()> {
    let agent_credit = &mut ctx.accounts.agent_credit;

    require!(agent_credit.due_at != 0, TabError::NotYetDue);
    let deadline = agent_credit
        .due_at
        .checked_add(DEFAULT_GRACE_SECONDS)
        .ok_or(TabError::MathOverflow)?;
    require!(now > deadline, TabError::GraceNotElapsed);

    // TODO(spike): tüm açık kanallar için payment_channels::request_close CPI.

    let loss = agent_credit.debt;

    // Waterfall adım 1: operatör bond.
    let from_bond = loss.min(agent_credit.bond);
    agent_credit.bond = agent_credit
        .bond
        .checked_sub(from_bond)
        .ok_or(TabError::MathOverflow)?;
    let mut remaining_loss = loss.saturating_sub(from_bond);

    // Adım 2: backer stake pro-rata (⏳ v2 — bkz. docs §8.7, §9.2).
    let from_backers = remaining_loss.min(agent_credit.backer_stake);
    agent_credit.backer_stake = agent_credit
        .backer_stake
        .checked_sub(from_backers)
        .ok_or(TabError::MathOverflow)?;
    remaining_loss = remaining_loss.saturating_sub(from_backers);

    // Adım 3: kalan kayıp senior LP share fiyatına yansır.
    if remaining_loss > 0 {
        let pool = &mut ctx.accounts.pool;
        pool.total_assets = pool.total_assets.saturating_sub(remaining_loss);
    }

    agent_credit.debt = 0;
    agent_credit.open_exposure = 0;
    agent_credit.due_at = 0;
    agent_credit.score = 0;
    agent_credit.status = AgentStatus::Defaulted;

    Ok(())
}
