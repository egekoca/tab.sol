use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::constants::POOL_SEED;
use crate::errors::TabError;
use crate::state::Pool;

#[derive(Accounts)]
pub struct LpDeposit<'info> {
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

/// share_price = total_assets / share_supply (ilk mevduatta 1:1).
pub fn handler(ctx: Context<LpDeposit>, amount: u64) -> Result<()> {
    require!(amount > 0, TabError::MathOverflow);

    let pool = &mut ctx.accounts.pool;
    let share_supply = ctx.accounts.share_mint.supply;

    let shares_to_mint = if share_supply == 0 || pool.total_assets == 0 {
        amount
    } else {
        (amount as u128)
            .checked_mul(share_supply as u128)
            .ok_or(TabError::MathOverflow)?
            .checked_div(pool.total_assets as u128)
            .ok_or(TabError::MathOverflow)? as u64
    };

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.lp_usdc_account.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.lp.to_account_info(),
            },
        ),
        amount,
    )?;

    let pool_bump = pool.bump;
    let seeds: &[&[u8]] = &[POOL_SEED, &[pool_bump]];
    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.share_mint.to_account_info(),
                to: ctx.accounts.lp_share_account.to_account_info(),
                authority: pool.to_account_info(),
            },
            &[seeds],
        ),
        shares_to_mint,
    )?;

    pool.total_assets = pool
        .total_assets
        .checked_add(amount)
        .ok_or(TabError::MathOverflow)?;

    // TODO(v2): deploy_idle — hedef kullanım dışı kısmı Kamino'ya yönlendir.

    Ok(())
}
