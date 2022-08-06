import { CustomizeContext } from "../../providers/CustomizeProvider";
import { useContext } from "react";
import { ArrowDown } from "react-feather";
import { Token } from "socket-v2-sdk";
import { Currency } from "../../types";
import { TokenDetail } from "./TokenDetail";

interface Props {
  srcDetails: {
    token: Token | Currency;
    amount: string;
  };
  srcRefuel?: {
    asset: Token | Currency;
    amount: string;
  };
  destDetails: {
    token: Token | Currency;
    amount: string;
  };
  destRefuel?: {
    asset: Token | Currency;
    amount: string;
  };
  onClick?: () => void;
}

export const TokenDetailsRow = (props: Props) => {
  const { srcDetails, srcRefuel, destDetails, destRefuel, onClick } = props;
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  return (
    <button
      onClick={onClick ?? null}
      disabled={!onClick}
      className={`skt-w skt-w-button skt-w-input px-3 py-4 border-widget-secondary flex flex-col items-start w-full ${
        !!onClick ? "hover:bg-widget-secondary" : ""
      }`}
      style={{ borderRadius: `calc(0.5rem * ${borderRadius})` }}
    >
      <div className="skt-w flex justify-between items-center w-full">
        <TokenDetail
          token={srcDetails?.token}
          amount={srcDetails?.amount}
          refuel={srcRefuel}
        />
        <ArrowDown
          className={`skt-w w-4 h-4 text-widget-secondary ${
            false ? "" : "-rotate-90"
          }`}
        />
        <TokenDetail
          token={destDetails?.token}
          amount={destDetails?.amount}
          refuel={destRefuel}
          rtl
        />
      </div>
    </button>
  );
};
