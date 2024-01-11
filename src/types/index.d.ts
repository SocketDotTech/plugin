import { ReactNode } from "react";
import { ChainId, UserTxType } from "@socket.tech/socket-v2-sdk";
type supportedBridges =
  | "hop"
  | "anyswap"
  | "anyswap-router-v4"
  | "anyswap-router-v6"
  | "polygon-bridge"
  | "arbitrum-bridge"
  | "hyphen"
  | "across"
  | "optimism-bridge"
  | "celer"
  | "refuel-bridge"
  | "stargate"
  | "connext"
  | "cctp"
  | "synapse"
  | "base-bridge"
  | "zora-bridge"
  | "zksync-native";

interface txData {
  hash: string;
  chainId: number;
}
export interface transactionDetails {
  sourceAmount: string;
  destinationAmount: string;
  sourceToken: Currency; // 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee denotes native token
  destinationToken: Currency;
  txData: txData[]; // tx hashes will be passed here
  bridgeName?: string; // will be passed only in case of cross chain swaps
  estimatedServiceTime?: string; // (in ms) will be passed only in case of cross chain swaps
  dexName?: string; // will be passed only in case of same chain swaps
}

export interface approveDetails {
  txHash: string;
  sourceToken: Currency,
  address: string;
  status: 'pending' | 'completed';
}

export type onNetworkChange = (network: Network) => void;
export type onTokenChange = (token: Currency) => void;

export interface FeeParams {
  feePercent: number;
  feeTakerAddress: string;
}

export interface WidgetProps {
  /** Socket API Key  */
  API_KEY: string;

  /** Web3 provider */
  provider?: any;

  /** Custom Source Networks */
  sourceNetworks?: number[];

  /** Custom Destination Networks */
  destNetworks?: number[];

  /**
   * To override Default Source Network
   *
   * Default source network is Polygon
   */
  defaultSourceNetwork?: number;

  /**
   * To override Default Destination Network
   *
   * Default destination network is Ethereum
   */
  defaultDestNetwork?: number;

  /**
   * Token List.
   *
   * You can pass the url to the token list or pass the list as JSON, as long as it matches the schema.
   * Token list schema - https://uniswap.org/tokenlist.schema.json
   */
  tokenList?: string | Currency[];

  /**
   * To override default source token.
   * Default token is USDC with Native token as a fallback.
   *
   * Pass the string "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" for native token
   */
  defaultSourceToken?: string;

  /**
   * To override default destination token.
   * Default token is USDC with Native token as a fallback.
   *
   * Pass the string "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" for native token
   */
  defaultDestToken?: string;

  /** To enable only single tx quotes */
  singleTxOnly?: boolean;

  /** Refuel feature allows the users to transfer gas tokens across the chains */
  enableRefuel?: boolean;

  /** To enable same chain swaps */
  enableSameChainSwaps?: boolean;

  /** To show refuel option only when it's supported for the user selected path */
  selectivelyShowRefuel?: boolean;

  /** To include bridges - only the bridges passed will be included */
  includeBridges?: supportedBridges[];

  /** To exclude bridges - bridges passed will be excluded from the original supported list */
  excludeBridges?: supportedBridges[];

  /** To set the default sort preference. Set to output by default */
  defaultSortPreference?: "time" | "output";

  /** To set the default amount. To set it on initial render */
  initialAmount?: string;

  // Widget Handlers

  /** An integration function called when the route is completed successfully.
   * @param {transactionDetails} data
   */
  onBridgeSuccess?: (data: transactionDetails) => void;

  /** An integration function called when the source network is changed
   * @param {Network} network (active source network)
   */
  onSourceNetworkChange?: onNetworkChange;

  /** An integration function called when the destination network is changed.
   * @param {Network} network (active destination network)
   */
  onDestinationNetworkChange?: onNetworkChange;

  /** An integration function called when the source token is changed.
   * @param {Currency} token (active source token)
   */
  onSourceTokenChange?: onTokenChange;

  /** An integration function called when the destination token is changed.
   * @param {Currency} token (active destination token)
   */
  onDestinationTokenChange?: onTokenChange;

  /** An integration function called when there is an error.
   * @param error
   */
  // Note - some error objects contain and additional data object and message resides within it.
  // These messages are usually more human readable. Hence on our frontend we check for e.data.message || e.message
  onError?: (error: any) => void;

  /**
   * An intergration function called when the transaction (including same chain swap) is submitted.
   *
   * This excludes the source and/or destination swap transactions in case of cross-chain swaps and only the bridging transaction will be considered
   * @param {transactionDetails} data
   */
  onSubmit?: (data: transactionDetails) => void;

  /**
   * This function is called twice, once when the approval is iniated and after it is completed
   * @param {approveDetails} data 
   */
  onApprove?: (data: approveDetails) => void;

  /**
   * Fee Params to collect fees
   *
   * feePercent
   * The % of fee to be cut from the source input token amount.
   * NOTE : Fee Percent can be up to three decimal places and cannot be more than 5%
   *
   * feeTakerAddress: the address where the fee will be sent to in the transaction
   */
  feeParams?: FeeParams;

  /** To hide integrator fee in the review section. Is set to false by default */
  hideIntegratorFee?: boolean;

  /** not supported */
  locale?: string;

  title?: ReactNode | string;
  customize?: Customize;
  zpHide?: boolean;
}

export interface Customize {
  // Width of the plugin
  width?: number;

  // To make the plugin responsive to the parent element.
  responsiveWidth?: boolean;

  // Border radius [0-1]
  borderRadius?: number;

  // All colors should stricktly be in RGB format
  // Theme color
  accent?: string;
  onAccent?: string;

  // Primary color - Used for background. Container, modal and almost everywhere.
  primary?: string;

  // Secondary color - Used for foreground. Hover effects, cards, etc.
  secondary?: string;

  // Primary text color - For headings and texts with emphasis.
  text?: string;

  // Secondary text color
  secondaryText?: string;

  // Interactive colors - for dropdowns
  interactive?: string;
  onInteractive?: string;

  // Outline color - used for lines, borders and icons
  outline?: string;

  // Font family
  fontFamily?: string;
}

export interface Network {
  chainId: number;
  currency: Currency;
  explorers: string[];
  icon: string;
  isL1: boolean;
  name: string;
  receivingEnabled: boolean;
  refuel: {
    sendingEnabled: boolean;
    receivingEnabled: boolean;
  };
  rpcs: string[];
  sendingEnabled: string;
}

export interface Currency {
  address: string;
  decimals: number;
  icon?: string;
  minNativeCurrencyForGas?: string;
  name: string;
  symbol: string;
  chainId?: number;
  logoURI: string;
  chainAgnosticId?: string | null;
}

export interface TokenWithBalance {
  chainId?: ChainId;
  tokenAddress?: string;
  userAddress?: string;
  balance?: string;
  decimals?: number;
  icon?: string;
  symbol?: string;
  name?: string;
}

export interface Route {
  routeId: string;
  fromAmount: string;
  chainGasBalances: any;
  minimumGasBalances: any;
  toAmount: string;
  userBridgeNames: Array<BridgeName>;
  totalUserTx: number;
  totalGasFeesInUsd: number;
  recipient: string;
  sender: string;
  userTxs: Array<UserTx>;
  serviceTime: number;
}

export interface UserTx {
  userTxType: UserTxType;
}

export interface BridgeName {
  name: string;
  icon?: string;
  serviceTime: number;
  displayName: string;
}

export interface TxDetails {
  txHash: string;
  userTxType: string;
  timeStamp: number;
}

export declare function Bridge(props: WidgetProps): JSX.Element;
