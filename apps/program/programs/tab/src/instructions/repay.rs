use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::constants::POOL_SEED;
use crate::errors::TabError;
use crate::state::{AgentCredit, Pool};

/// §8.6 / §11.2: ücret dağılımı senior/junior/protokol arasında bölünür.
#[derive(Accounts)]
pub struct Repay<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub agent_credit: Account<'info, AgentCredit>,

    #[account(mut, seeds = [POOL_SEED], bump = pool.bump)]
    pub pool: Account<'info, Pool>,

    #[account(mut, address = pool.vault)]
    pub vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub payer_usdc_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub(crate) fn handler(ctx: Context<Repay>, amount: u64) -> Result<()> {
    let agent_credit = &mut ctx.accounts.agent_credit;
    require!(amount <= agent_credit.debt, TabError::RepayExceedsDebt);

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.payer_usdc_account.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
        ),
        amount,
    )?;

    agent_credit.debt = agent_credit
        .debt
        .checked_sub(amount)
        .ok_or(TabError::MathOverflow)?;

    let pool = &mut ctx.accounts.pool;
    pool.total_assets = pool
        .total_assets
        .checked_add(amount)
        .ok_or(TabError::MathOverflow)?;
    // Ücret dağılımı (senior/junior/protokol payları) §11.2'de tanımlı; v2'de
    // ayrı fee-accrual hesapları üzerinden gerçek zamanlı dağıtılacak.

    if agent_credit.debt == 0 {
        agent_credit.due_at = 0;
        agent_credit.score = agent_credit.score.saturating_add(10).min(1000);
    }

    Ok(())
}
