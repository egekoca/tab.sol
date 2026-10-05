use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::TabError;
use crate::payment_channels;
use crate::state::{AgentCredit, CreditChannel, Merchant, Pool};

/// `distribute` sonrası iadeyi işler: harcanmayan kısım (deposit - settled)
/// otomatik olarak Pool'a döner (§4.1, §8.5).
#[derive(Accounts)]
pub struct CloseCreditChannel<'info> {
    pub closer: Signer<'info>,

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
        close = closer,
    )]
    pub credit_channel: Account<'info, CreditChannel>,

    /// CHECK: Payment Channels kanal PDA'sı; requestClose/distribute CPI'si
    /// bu hesap üzerinden yapılır (gün 1 spike sonrası doldurulacak).
    #[account(mut, address = credit_channel.channel)]
    pub channel: UncheckedAccount<'info>,

    #[account(address = payment_channels::program_id())]
    pub payment_channels_program: UncheckedAccount<'info>,
}

pub(crate) fn handler(ctx: Context<CloseCreditChannel>) -> Result<()> {
    let credit_channel = &mut ctx.accounts.credit_channel;
    require!(credit_channel.open, TabError::ChannelAlreadyClosed);

    let pool = &mut ctx.accounts.pool;
    let agent_credit = &mut ctx.accounts.agent_credit;
    let merchant = &mut ctx.accounts.merchant;

    let pool_bump = pool.bump;
    let signer_seeds: &[&[u8]] = &[POOL_SEED, &[pool_bump]];
    let _ = signer_seeds; // TODO(spike): payment_channels::request_close + distribute CPI

    // İade = deposit - last_seen_settled; `distribute` CPI'si bu tutarı
    // doğrudan vault'a yatırır (payer = Pool PDA), total_assets zaten bu
    // transferle güncellenmiş olur — burada sadece exposure muhasebesi düşülür.
    agent_credit.open_exposure = agent_credit
        .open_exposure
        .checked_sub(credit_channel.deposit)
        .ok_or(TabError::MathOverflow)?;
    merchant.current_exposure = merchant
        .current_exposure
        .checked_sub(credit_channel.deposit)
        .ok_or(TabError::MathOverflow)?;
    pool.total_open_exposure = pool
        .total_open_exposure
        .checked_sub(credit_channel.deposit)
        .ok_or(TabError::MathOverflow)?;

    credit_channel.open = false;

    Ok(())
}
