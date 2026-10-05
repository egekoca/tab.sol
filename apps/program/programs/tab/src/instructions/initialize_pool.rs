use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::constants::*;
use crate::state::Pool;

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + Pool::INIT_SPACE,
        seeds = [POOL_SEED],
        bump
    )]
    pub pool: Account<'info, Pool>,

    pub usdc_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = authority,
        token::mint = usdc_mint,
        token::authority = pool,
        seeds = [POOL_SEED, b"vault"],
        bump
    )]
    pub vault: Account<'info, TokenAccount>,

    /// tUSDC share mint; mint authority = Pool PDA.
    #[account(
        init,
        payer = authority,
        mint::decimals = usdc_mint.decimals,
        mint::authority = pool,
        seeds = [POOL_SEED, b"share_mint"],
        bump
    )]
    pub share_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<InitializePool>,
    protocol_fee_bps: u16,
    senior_share_bps: u16,
    junior_share_bps: u16,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    pool.authority = ctx.accounts.authority.key();
    pool.usdc_mint = ctx.accounts.usdc_mint.key();
    pool.vault = ctx.accounts.vault.key();
    pool.share_mint = ctx.accounts.share_mint.key();
    pool.total_assets = 0;
    pool.total_borrowed = 0;
    pool.total_open_exposure = 0;
    pool.protocol_fee_bps = protocol_fee_bps;
    pool.senior_share_bps = senior_share_bps;
    pool.junior_share_bps = junior_share_bps;
    pool.max_utilization_bps = DEFAULT_MAX_UTILIZATION_BPS;
    pool.bump = ctx.bumps.pool;
    Ok(())
}
