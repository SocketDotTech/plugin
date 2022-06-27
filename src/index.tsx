import "./index.css";
import { Provider } from "react-redux";
import store from "./state/store";
import { Widget } from "./components/Widget";
import { WidgetProps } from "@/utils/types";

export const Bridge = (props: WidgetProps) => {
  return (
    <Provider store={store}>
      <Widget />
    </Provider>
  );
};
