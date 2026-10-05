use anchor_lang::prelude::*;

#[constant]
pub const POOL_SEED: &[u8] = b"pool";
#[constant]
pub const AGENT_CREDIT_SEED: &[u8] = b"agent_credit";
#[constant]
pub const MERCHANT_SEED: &[u8] = b"merchant";
#[constant]
pub const CREDIT_CHANNEL_SEED: &[u8] = b"credit_channel";
#[constant]
pub const BACKER_POSITION_SEED: &[u8] = b"backer_position";

/// Solana Foundation Payment Channels program (mainnet).
/// Kaynak: docs/Tab_Proje_Dokumani.md §1.4 / §9.3
pub const PAYMENT_CHANNELS_PROGRAM_ID: &str = "CHNLxYvVA28MJP9PrFuDXccuoGXAx7jBacfLEkahyGsX";

/// Kanal tavanı artımı (§10.3 örnek parametre).
pub const DEFAULT_CEILING_INCREMENT: u64 = 5_000_000; // 6 ondalıklı USDC, $5
/// Vade: ilk tüketimden N saniye sonra.
pub const DEFAULT_DUE_SECONDS: i64 = 7 * 24 * 60 * 60;
/// Grace periyodu.
pub const DEFAULT_GRACE_SECONDS: i64 = 48 * 60 * 60;
/// Havuzun maksimum kullanım oranı (bps).
pub const DEFAULT_MAX_UTILIZATION_BPS: u16 = 8_000;
/// Yeni ajan çarpanı (10000 = 1.0x).
pub const DEFAULT_NEW_AGENT_MULTIPLIER_BPS: u16 = 10_000;
/// Maksimum çarpan (10000 = 1.0x, 30000 = 3.0x).
pub const MAX_MULTIPLIER_BPS: u16 = 30_000;
