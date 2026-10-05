use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::constants::POOL_SEED;
use crate::errors::TabError;
use crate::state::{AgentCredit, Pool};

#[derive(Accounts)]
pub struct StakeBond<'info> {
    #[account(mut, address = agent_credit.operator)]
    pub operator: Signer<'info>,

    #[account(mut)]
    pub agent_credit: Account<'info, AgentCredit>,

    #[account(seeds = [POOL_SEED], bump = pool.bump)]
    pub pool: Account<'info, Pool>,

    #[account(mut, address = pool.vault)]
    pub vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub operator_usdc_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn stake(ctx: Context<StakeBond>, amount: u64) -> Result<()> {
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.operator_usdc_account.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.operator.to_account_info(),
            },
        ),
        amount,
    )?;

    let agent_credit = &mut ctx.accounts.agent_credit;
    agent_credit.bond = agent_credit
        .bond
        .checked_add(amount)
        .ok_or(TabError::MathOverflow)?;
    Ok(())
}

#[derive(Accounts)]
pub struct UnstakeBond<'info> {
    #[account(mut, address = agent_credit.operator)]
    pub operator: Signer<'info>,

    #[account(mut)]
    pub agent_credit: Account<'info, AgentCredit>,

    #[account(seeds = [POOL_SEED], bump = pool.bump)]
    pub pool: Account<'info, Pool>,

    #[account(mut, address = pool.vault)]
    pub vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub operator_usdc_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

/// Sadece açık borç yoksa bond çekilebilir (doc §9.2).
pub fn unstake(ctx: Context<UnstakeBond>, amount: u64) -> Result<()> {
    let agent_credit = &mut ctx.accounts.agent_credit;
    require!(agent_credit.debt == 0, TabError::OutstandingDebt);
    agent_credit.bond = agent_credit
        .bond
        .checked_sub(amount)
        .ok_or(TabError::MathOverflow)?;

    let pool_bump = ctx.accounts.pool.bump;
    let seeds: &[&[u8]] = &[POOL_SEED, &[pool_bump]];
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.operator_usdc_account.to_account_info(),
                authority: ctx.accounts.pool.to_account_info(),
            },
            &[seeds],
        ),
        amount,
    )?;
    Ok(())
}
