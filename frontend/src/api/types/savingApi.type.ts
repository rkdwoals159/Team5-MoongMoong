import type { components } from "@schema";

export type BankCreateResponse = components["schemas"]["BankCreateResponse"];
export type BankUpdateResponse = components["schemas"]["BankUpdateResponse"];
export type BankBreakResponse = components["schemas"]["BankBreakResponse"];
export type BankInfoResponse = components["schemas"]["BankInfoResponse"];
export type CoinsResponse = components["schemas"]["CoinsResponse"];

export type OrderIdResponse = Required<components["schemas"]["CoinPaymentCreateResponse"]>;
export type ConfirmPaymentResponse = Required<components["schemas"]["CoinCreateResponse"]>;
