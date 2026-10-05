use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod payment_channels;
pub mod state;

use instructions::*;

declare_id!("TabXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

/// Tab — AI ajanlarına Solana Payment Channels üzerinden amaca bağlı kredi
/// açan protokol. Mimari ve akışlar için bkz. docs/Tab_Proje_Dokumani.md.
#[program]
pub mod tab {
    use super::*;

    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        protocol_fee_bps: u16,
        senior_share_bps: u16,
        junior_share_bps: u16,
    ) -> Result<()> {
        instructions::initialize_pool::handler(
            ctx,
            protocol_fee_bps,
            senior_share_bps,
            junior_share_bps,
        )
    }

    pub fn lp_deposit(ctx: Context<LpDeposit>, amount: u64) -> Result<()> {
        instructions::lp_deposit::handler(ctx, amount)
    }

    pub fn lp_withdraw(ctx: Context<LpWithdraw>, shares: u64) -> Result<()> {
        instructions::lp_withdraw::handler(ctx, shares)
    }

    pub fn register_agent(
        ctx: Context<RegisterAgent>,
        agent_signer: Pubkey,
        daily_limit: u64,
    ) -> Result<()> {
        instructions::register_agent::handler(ctx, agent_signer, daily_limit)
    }

    pub fn stake_bond(ctx: Context<StakeBond>, amount: u64) -> Result<()> {
        instructions::stake_bond::stake(ctx, amount)
    }

    pub fn unstake_bond(ctx: Context<UnstakeBond>, amount: u64) -> Result<()> {
        instructions::stake_bond::unstake(ctx, amount)
    }

    pub fn register_merchant(
        ctx: Context<RegisterMerchant>,
        mdr_bps: u16,
        settle_sla_secs: i64,
    ) -> Result<()> {
        instructions::register_merchant::handler(ctx, mdr_bps, settle_sla_secs)
    }

    pub fn approve_merchant(ctx: Context<ApproveMerchant>, exposure_cap: u64) -> Result<()> {
        instructions::approve_merchant::handler(ctx, exposure_cap)
    }

    pub fn open_credit_channel(
        ctx: Context<OpenCreditChannel>,
        ceiling: u64,
        grace_period_secs: i64,
    ) -> Result<()> {
        instructions::open_credit_channel::handler(ctx, ceiling, grace_period_secs)
    }

    pub fn top_up_credit_channel(ctx: Context<TopUpCreditChannel>, increment: u64) -> Result<()> {
        instructions::top_up_credit_channel::handler(ctx, increment)
    }

    pub fn record_settlement(
        ctx: Context<RecordSettlement>,
        settled: u64,
        fee_bps: u16,
        now: i64,
    ) -> Result<()> {
        instructions::record_settlement::handler(ctx, settled, fee_bps, now)
    }

    pub fn close_credit_channel(ctx: Context<CloseCreditChannel>) -> Result<()> {
        instructions::close_credit_channel::handler(ctx)
    }

    pub fn repay(ctx: Context<Repay>, amount: u64) -> Result<()> {
        instructions::repay::handler(ctx, amount)
    }

    pub fn mark_default(ctx: Context<MarkDefault>, now: i64) -> Result<()> {
        instructions::mark_default::handler(ctx, now)
    }
}
