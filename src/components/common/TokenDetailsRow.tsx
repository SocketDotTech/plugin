import { CustomizeContext } from "../../providers/CustomizeProvider";
import { useContext } from "react";
import { ArrowDown } from "react-feather";
import { Token } from "@socket.tech/socket-v2-sdk";
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
      className={`skt-w skt-w-button skt-w-input skt-w-px-3 skt-w-py-4 skt-w-border-widget-secondary skt-w-flex skt-w-flex-col skt-w-items-start skt-w-w-full ${
        !!onClick ? "hover:skt-w-bg-widget-secondary" : ""
      }`}
      style={{ borderRadius: `calc(0.5rem * ${borderRadius})` }}
    >
      <div className="skt-w skt-w-flex skt-w-justify-between skt-w-items-center skt-w-w-full">
        <TokenDetail
          token={srcDetails?.token}
          amount={srcDetails?.amount}
          refuel={srcRefuel}
        />
        <ArrowDown
          className={`skt-w skt-w-w-4 skt-w-h-4 skt-w-text-widget-secondary ${
            false ? "" : "skt-w--rotate-90"
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
