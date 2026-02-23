import type { components } from "@schema";

export type GetBankResponse = components["schemas"]["BankInfoResponse"];
export type GetBankCoinsResponse = components["schemas"]["CoinsResponse"];
export type PostBankResponse = components["schemas"]["BankCreateResponse"];
export type PatchBankResponse = components["schemas"]["BankUpdateResponse"];
export type DeleteBankResponse = components["schemas"]["BankBreakResponse"];

export type PostCoinOrderResponse = Required<components["schemas"]["CoinPaymentCreateResponse"]>;
export type PostCoinPaymentConfirmResponse = Required<components["schemas"]["CoinCreateResponse"]>;
