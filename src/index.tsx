import "./index.css";

import { Provider as ReduxProvider } from "react-redux";

import store from "./state/store";
import { WidgetProps } from "./types";

import { Widget } from "./components/Widget";
import { CustomizeProvider } from "./providers/CustomizeProvider";
import { Web3Provider } from "./providers/Web3Provider";
import { initSocket } from "./hooks/apis";
import { SWRConfig } from "swr";

export const Bridge = (props: WidgetProps) => {
  const { API_KEY, singleTxOnly = false } = props;

  if (!API_KEY) {
    return <IntegrationError>Please pass the API key</IntegrationError>;
  } else initSocket(API_KEY, singleTxOnly); // initialising socket sdk

  if (API_KEY) {
    return (
      <SWRConfig
        value={{
          suspense: false,
          revalidateIfStale: false,
          revalidateOnFocus: false,
        }}
      >
        <Web3Provider>
          <ReduxProvider store={store}>
            <CustomizeProvider>
              <Widget {...props} />
            </CustomizeProvider>
          </ReduxProvider>
        </Web3Provider>
      </SWRConfig>
    );
  }
};

const IntegrationError = ({ children }) => {
  return (
    <div className="skt-w skt-w-rounded-2xl skt-w-bg-gray-100 skt-w-w-[360px] skt-w-p-3 skt-w-h-[360px] skt-w-text-center skt-w-text-gray-500">
      {children}
    </div>
  );
};
