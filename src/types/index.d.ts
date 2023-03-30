import { ReactNode } from "react";
import { ChainId, UserTxType } from "@socket.tech/socket-v2-sdk";
type supportedBridges =
  | "polygon-bridge"
  | "hop"
  | "anyswap-router-v4"
  | "hyphen"
  | "arbitrum-bridge"
  | "connext"
  | "celer"
  | "across"
  | "optimism-bridge"
  | "refuel-bridge";

interface txData {
  hash: string;
  chainId: number;
}
export interface transactionDetails {
  sourceAmount: string;
  destinationAmount: string;
  sourceToken: Currency; // 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee denotes native token
  destinationToken: Currency;
  txData: txData[] // tx hashes will be passed here
  bridgeName?: string; // will be passed only in case of cross chain swaps
  estimatedServiceTime?: string; // (in ms) will be passed only in case of cross chain swaps
  dexName?: string; // will be passed only in case of same chain swaps
}

export type onNetworkChange = (network: Network) => void;
export type onTokenChange = (token: Currency) => void;

export interface WidgetProps {
  API_KEY: string;
  provider?: any;

  // Chain Ids array
  sourceNetworks?: number[];
  destNetworks?: number[];

  // Chain Id
  defaultSourceNetwork?: number;
  defaultDestNetwork?: number;

  // Token list
  // You can pass the url to the token list or pass the list as JSON, as long as it matches the schema
  // Token list schema - https://uniswap.org/tokenlist.schema.json
  tokenList?: string | Currency[];

  // Token address
  // Pass the string "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" for native token
  defaultSourceToken?: string;
  defaultDestToken?: string;

  // To enable only single tx quotes
  singleTxOnly?: boolean;

  // To enable refuel
  // Refuel feature allows the users to transfer gas tokens across the chains
  enableRefuel?: boolean;

  // To enable same chain swaps
  enableSameChainSwaps?: boolean;

  // To show refuel option only when it is valid
  selectivelyShowRefuel?: boolean;

  // To include bridges - only the bridges passed will be included
  includeBridges?: supportedBridges[];

  // To exclude bridges - bridges passed will be excluded from the original supported list
  excludeBridges?: supportedBridges[];

  // CALLBACK FUNCTIONS
  // Will be called when the route is completed successfully
  // @returns onBridgeSuccessReturn
  onBridgeSuccess?: (data: transactionDetails) => void;

  // Will be called when source network is changed, @returns Network (new source network)
  onSourceNetworkChange?: onNetworkChange;

  // Will be called when destination network is changed, @returns Network (new destination network)
  onDestinationNetworkChange?: onNetworkChange;

  // Will be called when source token is changed, @returns Currency (new source token)
  onSourceTokenChange?: onTokenChange;

  // Will be called when destination network is changed, @returns Currency (new destination token)
  onDestinationTokenChange?: onTokenChange;

  // Will be called when there is an error, @returns the error
  // Note - some error objects contain and additional data object and message resides within it
  // These messages are usually more human readable. Hence on our frontend we check for e.data.message || e.message
  onError?: (error: any) => void;

  // Will be called when the cross-chain swap or same chain swap transaction is submitted. 
  // This excludes the source and/or destination swap transactions in case of cross-chain swaps and only the bridging transaction will be considered
  onSubmit?: (data: transactionDetails) => void;

  locale?: string;
  title?: ReactNode | string;
  customize?: Customize;
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
