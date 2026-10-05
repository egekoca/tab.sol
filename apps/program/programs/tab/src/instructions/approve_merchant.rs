use anchor_lang::prelude::*;

use crate::state::{Merchant, MerchantStatus, Pool};

/// MVP: tek admin otoritesi onaylıyor (§8.3). v2'de arbiter/gov akışı.
#[derive(Accounts)]
pub struct ApproveMerchant<'info> {
    #[account(address = pool.authority)]
    pub admin: Signer<'info>,

    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub merchant: Account<'info, Merchant>,
}

pub(crate) fn handler(ctx: Context<ApproveMerchant>, exposure_cap: u64) -> Result<()> {
    let merchant = &mut ctx.accounts.merchant;
    merchant.exposure_cap = exposure_cap;
    merchant.status = MerchantStatus::Approved;
    Ok(())
}
