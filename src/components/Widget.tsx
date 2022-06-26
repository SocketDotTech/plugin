import { Socket, Supported } from "socket-v2-sdk";
// import { WidgetProps } from "@/utils/types";
// import { SOCKET_API_KEY } from "@/consts/index";
import { WidgetProps } from "../utils/types";
import { SOCKET_API_KEY } from "../consts";

// redux state
import { useDispatch } from "react-redux";
import { setNetworks } from "../state/networksSlice";
import { setDevProps } from "../state/devPropsSlice";

// components
// import { Header } from "@/components/Header";
// import { Input } from "@/components/Input";
import { Header } from "./Header";
import { Input } from "./Input";


export const Widget = (props: WidgetProps) => {
  const dispatch = useDispatch();
  const {
    width = 400,
    responsiveWidth = false,
    theme = {
      borderRadius: 1,
    },
  } = props;

  const socket = new Socket({ apiKey: SOCKET_API_KEY });

  async function initialize() {
    const supportedNetworks = await Supported.getAllSupportedRoutes();
    dispatch(setDevProps(props));
    dispatch(setNetworks(supportedNetworks?.result))
  }

  initialize();

  const widgetWidth = responsiveWidth ? "100%" : width > 300 ? width : 300;

  return (
      <div
        style={{
          width: widgetWidth,
          borderRadius: `calc(1rem * ${theme.borderRadius})`,
          height: '400px'
        }}
        className={`bg-gray-200 p-3 overflow-hidden`}
      >
        <Header title="Bridge">settings</Header>
        <Input />
      </div>
  );
};
