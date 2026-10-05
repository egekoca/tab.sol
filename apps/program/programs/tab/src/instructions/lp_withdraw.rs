use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, Token, TokenAccount, Transfer};

use crate::constants::POOL_SEED;
use crate::errors::TabError;
use crate::state::Pool;

/// MVP: kuyruksuz basit çekim. Vault'ta yetersiz likidite varsa reddedilir
/// (§8.1 — withdraw queue v2'de eklenecek, bkz. §13).
#[derive(Accounts)]
pub struct LpWithdraw<'info> {
    #[account(mut)]
    pub lp: Signer<'info>,

    #[account(mut, seeds = [POOL_SEED], bump = pool.bump)]
    pub pool: Account<'info, Pool>,

    #[account(mut, address = pool.vault)]
    pub vault: Account<'info, TokenAccount>,

    #[account(mut, address = pool.share_mint)]
    pub share_mint: Account<'info, Mint>,

    #[account(mut)]
    pub lp_usdc_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub lp_share_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<LpWithdraw>, shares: u64) -> Result<()> {
    require!(shares > 0, TabError::MathOverflow);

    let pool = &mut ctx.accounts.pool;
    let share_supply = ctx.accounts.share_mint.supply;

    let amount = (shares as u128)
        .checked_mul(pool.total_assets as u128)
        .ok_or(TabError::MathOverflow)?
        .checked_div(share_supply as u128)
        .ok_or(TabError::MathOverflow)? as u64;

    require!(
        ctx.accounts.vault.amount >= amount,
        TabError::WithdrawQueueUnsupported
    );

    token::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.share_mint.to_account_info(),
                from: ctx.accounts.lp_share_account.to_account_info(),
                authority: ctx.accounts.lp.to_account_info(),
            },
        ),
        shares,
    )?;

    let pool_bump = pool.bump;
    let seeds: &[&[u8]] = &[POOL_SEED, &[pool_bump]];
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.lp_usdc_account.to_account_info(),
                authority: pool.to_account_info(),
            },
            &[seeds],
        ),
        amount,
    )?;

    pool.total_assets = pool
        .total_assets
        .checked_sub(amount)
        .ok_or(TabError::MathOverflow)?;

    Ok(())
}
