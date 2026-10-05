use anchor_lang::prelude::*;

/// Global havuz. Payment Channels'da `payer` rolünü oynayan Pool PDA'nın
/// muhasebe durumu burada tutulur. Bkz. docs §9.1, §4.1.
#[account]
#[derive(InitSpace)]
pub struct Pool {
    pub authority: Pubkey,
    pub usdc_mint: Pubkey,
    pub vault: Pubkey,
    pub share_mint: Pubkey,
    pub total_assets: u64,
    pub total_borrowed: u64,
    pub total_open_exposure: u64,
    pub protocol_fee_bps: u16,
    pub senior_share_bps: u16,
    pub junior_share_bps: u16,
    pub max_utilization_bps: u16,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace, Debug)]
pub enum AgentStatus {
    Active,
    Frozen,
    Defaulted,
}

/// Ajan başına kredi defteri. `agent_signer`, Payment Channels kanalındaki
/// `authorizedSigner` ile eşleşir; `operator` ise bond'u yatıran taraf.
#[account]
#[derive(InitSpace)]
pub struct AgentCredit {
    pub operator: Pubkey,
    pub agent_signer: Pubkey,
    pub bond: u64,
    pub backer_stake: u64,
    /// 10_000 = 1.0x
    pub multiplier_bps: u16,
    /// 0-1000
    pub score: u16,
    pub debt: u64,
    pub open_exposure: u64,
    pub due_at: i64,
    pub status: AgentStatus,
    pub daily_limit: u64,
    pub bump: u8,
}

impl AgentCredit {
    /// limit = bond * multiplier(score) + backer_stake (§10.1)
    pub fn credit_limit(&self) -> Result<u64> {
        let from_bond = (self.bond as u128)
            .checked_mul(self.multiplier_bps as u128)
            .ok_or(crate::errors::TabError::MathOverflow)?
            .checked_div(10_000)
            .ok_or(crate::errors::TabError::MathOverflow)?;
        let total = from_bond
            .checked_add(self.backer_stake as u128)
            .ok_or(crate::errors::TabError::MathOverflow)?;
        Ok(total as u64)
    }
}

/// ⏳ v2 — sosyal underwriting (§6.5 Faz 2, §9.2).
#[account]
#[derive(InitSpace)]
pub struct BackerPosition {
    pub backer: Pubkey,
    pub agent: Pubkey,
    pub amount: u64,
    pub unlock_at: i64,
    pub fees_accrued: u64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace, Debug)]
pub enum MerchantStatus {
    Pending,
    Approved,
    Slashed,
}

#[account]
#[derive(InitSpace)]
pub struct Merchant {
    pub payee: Pubkey,
    pub bond: u64,
    pub exposure_cap: u64,
    pub current_exposure: u64,
    pub mdr_bps: u16,
    pub settle_sla_secs: i64,
    pub status: MerchantStatus,
    pub bump: u8,
}

/// Payment Channels PDA ile Tab muhasebesi arasındaki köprü (§9.1).
#[account]
#[derive(InitSpace)]
pub struct CreditChannel {
    pub channel: Pubkey,
    pub agent: Pubkey,
    pub merchant: Pubkey,
    pub deposit: u64,
    pub last_seen_settled: u64,
    pub open: bool,
    pub bump: u8,
}
