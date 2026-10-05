//! Solana Foundation Payment Channels programına (Pinocchio, Anchor IDL'siz)
//! raw CPI köprüsü. Bkz. docs/Tab_Proje_Dokumani.md §9.3.
//!
//! GÜN 1 SPIKE (öncelik #1 — §14.2):
//!   1. https://github.com/solana-foundation/payment-channels reposundan
//!      instruction discriminator'ları ve hesap sırasını çıkar.
//!   2. Aşağıdaki `open` fonksiyonunu gerçek layout ile doldur.
//!   3. Yerel validator'da mainnet programını klonlayarak doğrula:
//!      solana-test-validator --clone-upgradeable-program
//!        CHNLxYvVA28MJP9PrFuDXccuoGXAx7jBacfLEkahyGsX --url mainnet-beta
//!   4. Çalışmazsa Plan B: aynı arayüzü taklit eden "channel-mock" programına geç.

use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_lang::solana_program::pubkey::Pubkey;

use crate::constants::PAYMENT_CHANNELS_PROGRAM_ID;

pub fn program_id() -> Pubkey {
    PAYMENT_CHANNELS_PROGRAM_ID
        .parse()
        .expect("sabit program id geçersiz")
}

/// `open` instruction'ının ham hesap/veri yükü. Gerçek discriminator ve alan
/// sırası spike sonrası buraya yazılacak — bkz. dosya başı not.
pub struct OpenChannelArgs {
    pub deposit: u64,
    pub grace_period_secs: i64,
}

/// CPI: Pool PDA `payer` olarak `invoke_signed` ile imzalar (§8.4, §9.3).
///
/// TODO(gün 1 spike): instruction discriminator'ı ve account meta sırasını
/// payment-channels repo'sundan doğrula; bu gövde yer tutucudur.
#[allow(unused_variables)]
pub fn open<'info>(
    pool_pda: &AccountInfo<'info>,
    pool_signer_seeds: &[&[u8]],
    channel_account: &AccountInfo<'info>,
    authorized_signer: &AccountInfo<'info>,
    payee: &AccountInfo<'info>,
    mint: &AccountInfo<'info>,
    payment_channels_program: &AccountInfo<'info>,
    args: OpenChannelArgs,
) -> Result<()> {
    // Yer tutucu — gerçek ix verisi (discriminator + borsh alanları) spike
    // sonrası eklenecek.
    let data: Vec<u8> = Vec::new();

    let accounts = vec![
        AccountMeta::new(*pool_pda.key, true), // payer, signer (PDA invoke_signed)
        AccountMeta::new(*channel_account.key, false),
        AccountMeta::new_readonly(*authorized_signer.key, false),
        AccountMeta::new_readonly(*payee.key, false),
        AccountMeta::new_readonly(*mint.key, false),
    ];

    let ix = anchor_lang::solana_program::instruction::Instruction {
        program_id: *payment_channels_program.key,
        accounts,
        data,
    };

    invoke_signed(
        &ix,
        &[
            pool_pda.clone(),
            channel_account.clone(),
            authorized_signer.clone(),
            payee.clone(),
            mint.clone(),
            payment_channels_program.clone(),
        ],
        &[pool_signer_seeds],
    )?;

    Ok(())
}

// top_up / request_close / distribute için benzer şekilde doldurulacak
// yer tutucular — bkz. docs §8.4-§8.7.
