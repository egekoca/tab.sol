use anchor_lang::prelude::*;

use crate::constants::MERCHANT_SEED;
use crate::state::{Merchant, MerchantStatus};

#[derive(Accounts)]
pub struct RegisterMerchant<'info> {
    #[account(mut)]
    pub merchant_authority: Signer<'info>,

    /// Kanalın `payee`'si olacak hesap (PDA olabilir — §9.3 "open does NOT
    /// curve-check payee").
    /// CHECK: sadece pubkey referansı olarak saklanıyor.
    pub payee: UncheckedAccount<'info>,

    #[account(
        init,
        payer = merchant_authority,
        space = 8 + Merchant::INIT_SPACE,
        seeds = [MERCHANT_SEED, payee.key().as_ref()],
        bump
    )]
    pub merchant: Account<'info, Merchant>,

    pub system_program: Program<'info, System>,
}

pub(crate) fn handler(ctx: Context<RegisterMerchant>, mdr_bps: u16, settle_sla_secs: i64) -> Result<()> {
    let merchant = &mut ctx.accounts.merchant;
    merchant.payee = ctx.accounts.payee.key();
    merchant.bond = 0;
    merchant.exposure_cap = 0;
    merchant.current_exposure = 0;
    merchant.mdr_bps = mdr_bps;
    merchant.settle_sla_secs = settle_sla_secs;
    merchant.status = MerchantStatus::Pending;
    merchant.bump = ctx.bumps.merchant;
    Ok(())
}
