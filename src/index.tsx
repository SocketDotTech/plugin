import "./index.css";

import { Provider as ReduxProvider } from "react-redux";
import { createClient, WagmiConfig } from "wagmi";

import store from "./state/store";
import { WidgetProps } from "./utils/types";

import { Widget } from "./components/Widget";
import { CustomizeProvider } from "./components/CustomizeProvider";
import { initSocket } from "./hooks/apis";

export const Bridge = (props: WidgetProps) => {
  const { provider, API_KEY } = props;

  if (!provider) {
    return <IntegrationError>Please pass the provider</IntegrationError>;
  }
  if (!API_KEY) {
    return <IntegrationError>Please pass the API key</IntegrationError>;
  } else initSocket(API_KEY); // initialising socket sdk

  if (API_KEY && provider) {
    const wagmiClient = createClient({
      autoConnect: true,
      provider,
    });
    return (
      <WagmiConfig client={wagmiClient}>
        <ReduxProvider store={store}>
          <CustomizeProvider>
            <Widget {...props} />
          </CustomizeProvider>
        </ReduxProvider>
      </WagmiConfig>
    );
  }
};

const IntegrationError = ({ children }) => {
  return (
    <div className="rounded-2xl bg-gray-100 w-[360px] p-3 h-[360px] text-center text-gray-500">
      {children}
    </div>
  );
};
