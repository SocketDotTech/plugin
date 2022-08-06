import "./index.css";

import { Provider as ReduxProvider } from "react-redux";

import store from "./state/store";
import { WidgetProps } from "./types";

import { Widget } from "./components/Widget";
import { CustomizeProvider } from "./providers/CustomizeProvider";
import { Web3Provider } from "./providers/Web3Provider";
import { initSocket } from "./hooks/apis";

export const Bridge = (props: WidgetProps) => {
  const { API_KEY, singleTxOnly = false } = props;

  if (!API_KEY) {
    return <IntegrationError>Please pass the API key</IntegrationError>;
  } else initSocket(API_KEY, singleTxOnly); // initialising socket sdk

  if (API_KEY) {
    return (
      <Web3Provider>
        <ReduxProvider store={store}>
          <CustomizeProvider>
            <Widget {...props} />
          </CustomizeProvider>
        </ReduxProvider>
      </Web3Provider>
    );
  }
};

const IntegrationError = ({ children }) => {
  return (
    <div className="skt-w rounded-2xl bg-gray-100 w-[360px] p-3 h-[360px] text-center text-gray-500">
      {children}
    </div>
  );
};
