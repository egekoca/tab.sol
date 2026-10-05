use anchor_lang::prelude::*;

#[error_code]
pub enum TabError {
    #[msg("Merchant allowlist'te değil veya onaylanmamış")]
    MerchantNotApproved,
    #[msg("Talep edilen tavan ajanın kredi limitini aşıyor")]
    ExceedsAgentLimit,
    #[msg("Talep edilen tavan merchant'ın maruziyet tavanını aşıyor")]
    ExceedsMerchantCap,
    #[msg("Talep edilen tavan havuzun maksimum kullanım oranını aşıyor")]
    ExceedsPoolUtilization,
    #[msg("Ajan durumu aktif değil (Frozen veya Defaulted)")]
    AgentNotActive,
    #[msg("Kanal zaten kapalı")]
    ChannelAlreadyClosed,
    #[msg("Kanal hâlâ açık bir borca sahip")]
    OutstandingDebt,
    #[msg("Borç vadesi henüz geçmedi")]
    NotYetDue,
    #[msg("Grace periyodu henüz dolmadı")]
    GraceNotElapsed,
    #[msg("Geri ödeme tutarı borçtan büyük")]
    RepayExceedsDebt,
    #[msg("Hesap yetkilendirmesi başarısız")]
    Unauthorized,
    #[msg("Aritmetik taşma")]
    MathOverflow,
    #[msg("Likidite kuyruğu henüz desteklenmiyor (v2)")]
    WithdrawQueueUnsupported,
}
