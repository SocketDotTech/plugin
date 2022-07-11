export * from "./time";

export const SOCKET_API_KEY = process.env.REACT_APP_SOCKET_API_KEY;
export const SOCKET_API = process.env.REACT_APP_SOCKET_API;
export const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

enum UserTxTypes {
  FUND_MOVR = "fund-movr",
  DEX_SWAP = "dex-swap",
  APPROVE = "approve",
  CLAIM = "claim",
  SIGN = "sign",
}

export const USER_TX_LABELS = {
  [UserTxTypes.APPROVE]: "Approve",
  [UserTxTypes.FUND_MOVR]: "Bridge",
  [UserTxTypes.DEX_SWAP]: "Swap",
  [UserTxTypes.CLAIM]: "Claim",
  [UserTxTypes.SIGN]: "Sign",
};

enum BRIDGE_IDENTIFIERS  {
  POLYGON_BRIDGE = 'polygon-bridge',
  HOP = 'hop',
  ACROSS = 'across',
  HYPHEN = 'hyphen',
  REFUEL_BRIDGE = 'refuel-bridge',
  MULTICHAIN_BRIDGE = 'anyswap-router-v4',
  CELER_BRIDGE = 'celer',
  CONNEXT_BRIDGE = 'connext',
  OPTIMISM_BRIDGE = 'optimism-bridge',
  ARBITRUM_BRIDGE = 'arbitrum-bridge',
}

export const BRIDGE_DISPLAY_NAMES = {
  [BRIDGE_IDENTIFIERS.POLYGON_BRIDGE]: "Polygon",
  [BRIDGE_IDENTIFIERS.HOP]: "Hop",
  [BRIDGE_IDENTIFIERS.ACROSS]: "Across",
  [BRIDGE_IDENTIFIERS.HYPHEN]: "Hyphen",
  [BRIDGE_IDENTIFIERS.REFUEL_BRIDGE]: "Refuel",
  [BRIDGE_IDENTIFIERS.MULTICHAIN_BRIDGE]: "Multichain",
  [BRIDGE_IDENTIFIERS.CELER_BRIDGE]: "Celer",
  [BRIDGE_IDENTIFIERS.OPTIMISM_BRIDGE]: "Optimism",
  [BRIDGE_IDENTIFIERS.ARBITRUM_BRIDGE]: "Arbitrum",
  [BRIDGE_IDENTIFIERS.CONNEXT_BRIDGE]: "Connext",
};
