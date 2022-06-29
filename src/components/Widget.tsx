import { useEffect } from "react";
import { WidgetProps } from "../utils/types";
import { useDispatch } from "react-redux";
import { setDevProps } from "../state/devPropsSlice";

// components
import { Header } from "./Header";
import { Input } from "./Input";
import { Output } from "./Output";
import { RouteDetails } from "./RouteDetails";

// hooks
import { useChains, useTokenList } from "../hooks/apis";
import { Settings } from "./Settings";

export const Widget = (props: WidgetProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setDevProps(props));
  }, []);
  useChains();
  useTokenList();

  const {
    width = 380,
    responsiveWidth = false,
    theme = {
      borderRadius: 1,
    },
  } = props;

  const widgetWidth = responsiveWidth ? "100%" : width > 300 ? width : 300;

  return (
    <div
      style={{
        width: widgetWidth,
        borderRadius: `calc(1rem * ${theme.borderRadius})`,
      }}
      className={`bg-gray-200 p-3 overflow-hidden relative`}
    >
      <Header title="Bridge"><Settings /></Header>
      <Input />
      <Output />
      <RouteDetails />
    </div>
  );
};
