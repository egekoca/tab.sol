import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Tab } from "../target/types/tab";
import { expect } from "chai";

// Gün 1 spike testi (bkz. docs/Tab_Proje_Dokumani.md §14.2):
// Pool PDA'nın payer olarak Payment Channels CPI `open` çağrısını
// yerel klonlanmış mainnet programına karşı doğrular.
describe("tab", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Tab as Program<Tab>;

  it("initialize_pool", async () => {
    // TODO: mint oluştur, pool PDA türet, initialize_pool çağır, hesabı doğrula.
    expect(program.programId).to.not.be.undefined;
  });

  it("CPI spike: open_credit_channel klonlanmış Payment Channels programına karşı", async () => {
    // TODO(gün 1): solana-test-validator --clone-upgradeable-program
    // CHNLxYvVA28MJP9PrFuDXccuoGXAx7jBacfLEkahyGsX --url mainnet-beta
    // ile başlat, gerçek instruction layout'unu payment_channels.rs'e taşı.
  });
});
