export interface WidgetProps {
  width?: number;
  responsiveWidth?: boolean;
  theme?: ThemeProps;
  sourceNetworks?: number[];
}

export interface ThemeProps {
  borderRadius: number;
  success: string;
  warning: string;
  error: string;
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
  icon: string;
  minNativeCurrencyForGas: string;
  name: string;
  symbol: string;
}
