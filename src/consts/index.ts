import { constants } from "@socket.tech/ll-core";
export * from "./time";

// Socket uses this address for native tokens. For example -> ETH on Ethereum, MATIC on Polygon, etc.
export const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

// Types of Txs possible in a route.
export enum UserTxType {
  FUND_MOVR = "fund-movr",
  DEX_SWAP = "dex-swap",
  APPROVE = "approve",
  CLAIM = "claim",
  SIGN = "sign",
}

// Labels for the tx types.
export const USER_TX_LABELS = {
  [UserTxType.APPROVE]: "Approve",
  [UserTxType.FUND_MOVR]: "Bridge",
  [UserTxType.DEX_SWAP]: "Swap",
  [UserTxType.CLAIM]: "Claim",
  [UserTxType.SIGN]: "Sign",
};

// Display Names for bridges.
export const BRIDGE_DISPLAY_NAMES = {
  [constants.bridges.PolygonBridge]: "Polygon",
  [constants.bridges.Hop]: "Hop",
  [constants.bridges.Across]: "Across",
  [constants.bridges.Hyphen]: "Hyphen",
  [constants.bridges.refuel]: "Refuel",
  [constants.bridges.AnySwapRouterV4]: "Multichain",
  [constants.bridges.Celer]: "Celer",
  [constants.bridges.ArbitrumBridge]: "Arbitrum",
  [constants.bridges.OptimismBridge]: "Optimism",
};

// Status of the prepare API. 
export enum PrepareTxStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  READY = 'ready',
}

export enum QuoteStatus {
  FETCHING_QUOTE = 'Fetching best quote...',
  NO_ROUTES_AVAILABLE = 'No routes available',
  ENTER_AMOUNT = 'Enter amount',
}

export enum ButtonTexts {
  NOT_ENOUGH_NATIVE_BALANCE = "Native token not enough",
  NOT_ENOUGH_BALANCE = 'Not enough balance',
  REVIEW_QUOTE = 'Review Quote',
  CHECKING_APPROVAL = 'Checking approval',
  APPROVING = 'Approving',
  APPROVE = 'Approve',
  APPROVAL_DONE = 'Approved',
  BRIDGE_IN_PROGRESS = 'Bridging in progress',
  INITIATING = 'Initiating...',
  IN_PROGRESS = 'In progress',
  REFETCHING = 'Refetching...'
}
