use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::TabError;
use crate::payment_channels::{self, OpenChannelArgs};
use crate::state::{AgentCredit, AgentStatus, CreditChannel, Merchant, MerchantStatus, Pool};

/// Çekirdek akış (§8.4): kontroller + Payment Channels'a CPI `open`.
/// Pool PDA `payer`, ajan `authorizedSigner`, merchant `payee` olur.
#[derive(Accounts)]
pub struct OpenCreditChannel<'info> {
    pub agent_signer: Signer<'info>,

    #[account(mut, seeds = [POOL_SEED], bump = pool.bump)]
    pub pool: Account<'info, Pool>,

    #[account(
        mut,
        seeds = [AGENT_CREDIT_SEED, agent_signer.key().as_ref()],
        bump = agent_credit.bump,
        has_one = agent_signer @ TabError::Unauthorized,
    )]
    pub agent_credit: Account<'info, AgentCredit>,

    #[account(mut)]
    pub merchant: Account<'info, Merchant>,

    #[account(
        init,
        payer = agent_signer,
        space = 8 + CreditChannel::INIT_SPACE,
        seeds = [CREDIT_CHANNEL_SEED, channel.key().as_ref()],
        bump
    )]
    pub credit_channel: Account<'info, CreditChannel>,

    /// CHECK: Payment Channels programının oluşturacağı kanal PDA'sı; layout
    /// o programa ait, burada sadece pubkey referansı tutulur.
    #[account(mut)]
    pub channel: UncheckedAccount<'info>,

    /// CHECK: USDC mint, CPI'ye iletiliyor.
    pub usdc_mint: UncheckedAccount<'info>,

    /// CHECK: Solana Foundation Payment Channels programı (sabit adres).
    #[account(address = payment_channels::program_id())]
    pub payment_channels_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<OpenCreditChannel>, ceiling: u64, grace_period_secs: i64) -> Result<()> {
    let agent_credit = &mut ctx.accounts.agent_credit;
    let merchant = &mut ctx.accounts.merchant;
    let pool = &mut ctx.accounts.pool;

    require!(agent_credit.status == AgentStatus::Active, TabError::AgentNotActive);
    require!(merchant.status == MerchantStatus::Approved, TabError::MerchantNotApproved);

    // §10.1 kısıtları
    let limit = agent_credit.credit_limit()?;
    let new_exposure = agent_credit
        .debt
        .checked_add(agent_credit.open_exposure)
        .and_then(|v| v.checked_add(ceiling))
        .ok_or(TabError::MathOverflow)?;
    require!(new_exposure <= limit, TabError::ExceedsAgentLimit);

    let new_merchant_exposure = merchant
        .current_exposure
        .checked_add(ceiling)
        .ok_or(TabError::MathOverflow)?;
    require!(new_merchant_exposure <= merchant.exposure_cap, TabError::ExceedsMerchantCap);

    let new_pool_exposure = pool
        .total_open_exposure
        .checked_add(ceiling)
        .ok_or(TabError::MathOverflow)?;
    let max_utilization = (pool.total_assets as u128)
        .checked_mul(pool.max_utilization_bps as u128)
        .ok_or(TabError::MathOverflow)?
        / 10_000;
    require!((new_pool_exposure as u128) <= max_utilization, TabError::ExceedsPoolUtilization);

    // CPI: Pool PDA imzacı olarak Payment Channels'a `open` çağrısı.
    let pool_bump = pool.bump;
    let signer_seeds: &[&[u8]] = &[POOL_SEED, &[pool_bump]];
    payment_channels::open(
        &pool.to_account_info(),
        signer_seeds,
        &ctx.accounts.channel.to_account_info(),
        &ctx.accounts.agent_signer.to_account_info(),
        &merchant.to_account_info(),
        &ctx.accounts.usdc_mint.to_account_info(),
        &ctx.accounts.payment_channels_program.to_account_info(),
        OpenChannelArgs {
            deposit: ceiling,
            grace_period_secs,
        },
    )?;

    // Muhasebe
    agent_credit.open_exposure = agent_credit
        .open_exposure
        .checked_add(ceiling)
        .ok_or(TabError::MathOverflow)?;
    merchant.current_exposure = new_merchant_exposure;
    pool.total_open_exposure = new_pool_exposure;

    let credit_channel = &mut ctx.accounts.credit_channel;
    credit_channel.channel = ctx.accounts.channel.key();
    credit_channel.agent = agent_credit.key();
    credit_channel.merchant = merchant.key();
    credit_channel.deposit = ceiling;
    credit_channel.last_seen_settled = 0;
    credit_channel.open = true;
    credit_channel.bump = ctx.bumps.credit_channel;

    Ok(())
}
