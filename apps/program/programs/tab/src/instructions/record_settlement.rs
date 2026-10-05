use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::TabError;
use crate::state::{AgentCredit, CreditChannel};

/// Permissionless keeper ix (§8.5): kanalın `settled` alanını okuyup
/// AgentCredit.debt'i günceller. delta = settled - last_seen_settled.
#[derive(Accounts)]
pub struct RecordSettlement<'info> {
    pub keeper: Signer<'info>,

    #[account(mut)]
    pub agent_credit: Account<'info, AgentCredit>,

    #[account(
        mut,
        seeds = [CREDIT_CHANNEL_SEED, credit_channel.channel.as_ref()],
        bump = credit_channel.bump,
    )]
    pub credit_channel: Account<'info, CreditChannel>,

    /// CHECK: Payment Channels kanal hesabı; `settled` alanı deserialize
    /// edilip okunacak (gün 1 spike'ta layout netleşecek).
    #[account(address = credit_channel.channel)]
    pub channel: UncheckedAccount<'info>,
}

/// `fee_bps`: kredi ücreti (§11.1, örn. %1).
pub fn handler(ctx: Context<RecordSettlement>, settled: u64, fee_bps: u16, now: i64) -> Result<()> {
    let credit_channel = &mut ctx.accounts.credit_channel;
    let agent_credit = &mut ctx.accounts.agent_credit;

    require!(settled >= credit_channel.last_seen_settled, TabError::MathOverflow);
    let delta = settled
        .checked_sub(credit_channel.last_seen_settled)
        .ok_or(TabError::MathOverflow)?;

    if delta == 0 {
        return Ok(());
    }

    let fee = (delta as u128)
        .checked_mul(fee_bps as u128)
        .ok_or(TabError::MathOverflow)?
        .checked_div(10_000)
        .ok_or(TabError::MathOverflow)? as u64;

    agent_credit.debt = agent_credit
        .debt
        .checked_add(delta)
        .and_then(|v| v.checked_add(fee))
        .ok_or(TabError::MathOverflow)?;

    if agent_credit.due_at == 0 {
        agent_credit.due_at = now
            .checked_add(DEFAULT_DUE_SECONDS)
            .ok_or(TabError::MathOverflow)?;
    }

    credit_channel.last_seen_settled = settled;

    Ok(())
}
