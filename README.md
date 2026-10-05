# tab.

AI ajanlarına Solana **Payment Channels** üzerinden amaca bağlı kredi açan protokol. Para sadece onaylı merchant'lara akar, harcanmayan kısım otomatik olarak LP'lere geri döner, temerrüt riski önce ajanın stake'inden karşılanır.

> Tam proje dokümanı (problem, mimari, akışlar, 7 günlük plan, pitch senaryosu): [`docs/Tab_Proje_Dokumani.md`](./docs/Tab_Proje_Dokumani.md)

Colosseum Crypto World's Fair — Solana Track · Son teslim: 12 Ekim 2026 (SGT, platformdan teyit edilmeli)

## Monorepo yapısı

```
apps/
  program/        Anchor programı (Rust) — Pool, AgentCredit, Merchant, CreditChannel
  frontend/        Next.js dashboard (LP / ajan / merchant görünümü)
  keeper/          Cron servisi — settle takibi, top-up, default tespiti
  mock-merchant/   Paralı inference proxy (demo merchant)
  demo-agent/      Sıfır bakiyeli demo ajanı
packages/
  shared/          Paylaşılan TS tipleri + sabitler (programın state.rs'i ile birebir)
brand/             Marka kiti (logo SVG/PNG + marka sayfası)
docs/              Proje dokümanı
```

Mimari diyagramı ve tüm akış şemaları (mermaid) için doküman §7 ve §8'e bakın.

## Teknoloji yığını

| Katman | Seçim |
|---|---|
| Zincir programı | Rust + Anchor 0.30, raw `invoke_signed` CPI → Pinocchio Payment Channels (`CHNLx...GsX`) |
| Token | USDC (SPL) |
| Frontend | Next.js 14 (App Router) + Tailwind, marka paleti |
| Keeper | Node/TS cron servisi |
| Mock merchant | Express ödemeli inference proxy |

## Kurulum

```bash
# Node bağımlılıkları
pnpm install

# Solana + Anchor CLI (yüklü değilse)
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest && avm use latest
```

### Gün 1 — CPI spike (öncelik #1)

```bash
solana-test-validator \
  --clone-upgradeable-program CHNLxYvVA28MJP9PrFuDXccuoGXAx7jBacfLEkahyGsX \
  --url mainnet-beta
```

`apps/program/programs/tab/src/payment_channels.rs` içindeki `open` CPI'sinin gerçek instruction layout'unu bu validator'a karşı doğrulayın — detaylar dosyanın başındaki notta.

### Geliştirme

```bash
pnpm dev:frontend     # http://localhost:3000
pnpm dev:keeper
pnpm dev:merchant     # http://localhost:4001
pnpm dev:agent

cd apps/program && anchor test
```

## Marka

- Renkler: Dark Cherry `#6B1D2C` · Obsidian `#0E0E10` · Cloud `#F5F5F7`
- Varlıklar: [`brand/logo`](./brand/logo) (SVG + PNG, siyah/beyaz/bordo varyantlar, favicon)
- Marka sayfası: [`brand/sheet/tab-brand-sheet.png`](./brand/sheet/tab-brand-sheet.png)

## MVP kapsamı ve 7 günlük plan

Bkz. doküman §13 (MVP Kapsamı) ve §14 (7 Günlük Plan). Kapsam dışına çıkmayın — demo riski en büyük zayıf yön (§5, §6.2).
