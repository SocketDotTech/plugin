export * from "./time";

export const SOCKET_API_KEY = process.env.REACT_APP_SOCKET_API_KEY;
export const SOCKET_API = process.env.REACT_APP_SOCKET_API;
export const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const USER_TX_LABELS = {
  "fund-movr": "Bridge",
  "dex-swap": "Swap",
  approve: "Approve",
  claim: "Claim",
  sign: "Sign",
};

export const BRIDGE_NAMES = {
  'polygon-bridge': 'Polygon',
  'hop': 'Hop',
  'across': 'Across',
  'hyphen': 'Hyphen',
  'refuel-bridge': 'Refuel',
  'anyswap-router-v4': 'Multichain',
  'celer': 'Celer',
  'optimism-bridge': 'Optimism',
  'arbitrum-bridge': 'Arbitrum',
  'connext': 'Connext',
}
