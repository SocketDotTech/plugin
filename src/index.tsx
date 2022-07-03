import "./index.css";
import { Provider as ReduxProvider } from "react-redux";
import store from "./state/store";
import { Widget } from "./components/Widget";
import { WidgetProps } from "./utils/types";
import { createClient, WagmiConfig } from "wagmi";

export const Bridge = (props: WidgetProps) => {
  const { provider, customize } = props;
  const wagmiClient = createClient({
    autoConnect: true,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <ReduxProvider store={store}>
        <Widget customize={customize} />
      </ReduxProvider>
    </WagmiConfig>
  );
};
