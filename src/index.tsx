import "./index.css";

import { Provider as ReduxProvider } from "react-redux";
import { createClient, WagmiConfig } from "wagmi";

import store from "./state/store";
import { WidgetProps } from "./utils/types";

import { Widget } from "./components/Widget";
import { CustomizeProvider } from "./components/CustomizeProvider";

export const Bridge = (props: WidgetProps) => {
  const { provider } = props;

  const wagmiClient = provider ? createClient({
    autoConnect: true,
    provider,
  }) : null;

  if (!provider) {
    return <div className="rounded-2xl bg-gray-100 w-[360px] p-3 h-[360px] text-center text-gray-500">Please pass the provider</div>;
  }
  return (
    <WagmiConfig client={wagmiClient}>
      <ReduxProvider store={store}>
        <CustomizeProvider>
          <Widget {...props} />
        </CustomizeProvider>
      </ReduxProvider>
    </WagmiConfig>
  );
};
