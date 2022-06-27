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

export const Widget = (props: WidgetProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setDevProps(props));
  }, []);
  useChains();
  useTokenList();

  const {
    width = 400,
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
        height: "400px",
      }}
      className={`bg-gray-200 p-3 overflow-hidden relative`}
    >
      <Header title="Bridge">settings</Header>
      <Input />
      <Output />
      <RouteDetails />
    </div>
  );
};
