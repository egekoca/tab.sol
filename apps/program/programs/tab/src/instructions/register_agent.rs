use anchor_lang::prelude::*;

use crate::constants::*;
use crate::state::{AgentCredit, AgentStatus};

#[derive(Accounts)]
#[instruction(agent_signer: Pubkey)]
pub struct RegisterAgent<'info> {
    #[account(mut)]
    pub operator: Signer<'info>,

    #[account(
        init,
        payer = operator,
        space = 8 + AgentCredit::INIT_SPACE,
        seeds = [AGENT_CREDIT_SEED, agent_signer.as_ref()],
        bump
    )]
    pub agent_credit: Account<'info, AgentCredit>,

    pub system_program: Program<'info, System>,
}

pub(crate) fn handler(ctx: Context<RegisterAgent>, agent_signer: Pubkey, daily_limit: u64) -> Result<()> {
    let agent_credit = &mut ctx.accounts.agent_credit;
    agent_credit.operator = ctx.accounts.operator.key();
    agent_credit.agent_signer = agent_signer;
    agent_credit.bond = 0;
    agent_credit.backer_stake = 0;
    agent_credit.multiplier_bps = DEFAULT_NEW_AGENT_MULTIPLIER_BPS;
    agent_credit.score = 0;
    agent_credit.debt = 0;
    agent_credit.open_exposure = 0;
    agent_credit.due_at = 0;
    agent_credit.status = AgentStatus::Active;
    agent_credit.daily_limit = daily_limit;
    agent_credit.bump = ctx.bumps.agent_credit;
    Ok(())
}
