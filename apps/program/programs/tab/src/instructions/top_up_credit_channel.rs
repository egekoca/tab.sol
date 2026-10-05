use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::TabError;
use crate::payment_channels;
use crate::state::{AgentCredit, AgentStatus, CreditChannel, Merchant, Pool};

/// Keeper tarafından tetiklenir (§8.6): settled, ceiling'e yaklaştıysa ve
/// borç limitin altındaysa revolving top-up yapılır.
#[derive(Accounts)]
pub struct TopUpCreditChannel<'info> {
    #[account(mut)]
    pub keeper: Signer<'info>,

    #[account(mut, seeds = [POOL_SEED], bump = pool.bump)]
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub agent_credit: Account<'info, AgentCredit>,

    #[account(mut)]
    pub merchant: Account<'info, Merchant>,

    #[account(
        mut,
        seeds = [CREDIT_CHANNEL_SEED, credit_channel.channel.as_ref()],
        bump = credit_channel.bump,
    )]
    pub credit_channel: Account<'info, CreditChannel>,

    /// CHECK: Payment Channels kanal PDA'sı.
    #[account(mut, address = credit_channel.channel)]
    pub channel: UncheckedAccount<'info>,

    #[account(address = payment_channels::program_id())]
    pub payment_channels_program: UncheckedAccount<'info>,
}

pub(crate) fn handler(ctx: Context<TopUpCreditChannel>, increment: u64) -> Result<()> {
    let agent_credit = &mut ctx.accounts.agent_credit;
    let merchant = &mut ctx.accounts.merchant;
    let pool = &mut ctx.accounts.pool;
    let credit_channel = &mut ctx.accounts.credit_channel;

    require!(credit_channel.open, TabError::ChannelAlreadyClosed);
    require!(agent_credit.status == AgentStatus::Active, TabError::AgentNotActive);

    // Maks. risk = açık borç + bir artım (§8.6)
    let limit = agent_credit.credit_limit()?;
    let projected = agent_credit
        .debt
        .checked_add(agent_credit.open_exposure)
        .and_then(|v| v.checked_add(increment))
        .ok_or(TabError::MathOverflow)?;
    require!(projected <= limit, TabError::ExceedsAgentLimit);

    let pool_bump = pool.bump;
    let signer_seeds: &[&[u8]] = &[POOL_SEED, &[pool_bump]];
    let _ = signer_seeds; // TODO(spike): payment_channels::top_up CPI'si eklenecek

    agent_credit.open_exposure = agent_credit
        .open_exposure
        .checked_add(increment)
        .ok_or(TabError::MathOverflow)?;
    merchant.current_exposure = merchant
        .current_exposure
        .checked_add(increment)
        .ok_or(TabError::MathOverflow)?;
    pool.total_open_exposure = pool
        .total_open_exposure
        .checked_add(increment)
        .ok_or(TabError::MathOverflow)?;
    credit_channel.deposit = credit_channel
        .deposit
        .checked_add(increment)
        .ok_or(TabError::MathOverflow)?;

    Ok(())
}
