import { Token } from "@socket.tech/socket-v2-sdk";
import useMappedChainData from "../../hooks/useMappedChainData";
import { formatCurrencyAmount } from "../../utils";
import { Currency } from "../../types";
import { CustomizeContext } from "../../providers/CustomizeProvider";
import { useContext } from "react";

interface TokenAssetProps {
  token: Currency | Token;
  refuel?: { amount: string; asset: Currency | Token };
  rtl?: boolean;
  amount: string;
  small?: boolean;
}
export const TokenDetail = (props: TokenAssetProps) => {
  const { token, rtl = false, amount, small = false, refuel } = props;
  const mappedChaindata = useMappedChainData();
  const chain = mappedChaindata?.[token?.chainId];
  const formattedAmount = formatCurrencyAmount(amount, token?.decimals, 4);
  const formattedRefuelAmount = formatCurrencyAmount(
    refuel?.amount,
    refuel?.asset?.decimals,
    3
  );
  const refuelEnabled = !!refuel?.amount;

  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  return (
    <div
      className={`skt-w skt-w-flex skt-w-flex-col skt-w-flex-1 skt-w-max-w-full ${
        rtl ? "skt-w-items-end" : "skt-w-flex-row"
      }`}
      style={{ borderRadius: `calc(0.7rem * ${borderRadius})` }}
    >
      <div
        className={`skt-w skt-w-flex skt-w-items-center skt-w-flex-1 skt-w-overflow-hidden ${
          rtl ? "skt-w-flex-row-reverse" : "skt-w-flex-row"
        }`}
      >
        <div className={`skt-w skt-w-relative skt-w-flex skt-w-flex-shrink-0`}>
          <img
            src={token?.logoURI}
            className="skt-w skt-w-w-6 skt-w-h-6 skt-w-rounded-full skt-w-border-widget-primary"
          />
          {!!refuel?.amount && (
            <img
              src={refuel?.asset?.logoURI}
              className="skt-w skt-w-w-6 skt-w-h-6 skt-w-rounded-full skt-w--ml-2 skt-w-border-2 skt-w-border-widget-accent skt-w-object-cover skt-w-bg-widget-accent"
            />
          )}
        </div>

        <div
          className={`skt-w skt-w-flex skt-w-flex-col skt-w-flex-auto skt-w-overflow-hidden ${
            rtl ? "skt-w-items-end skt-w-mr-2" : "skt-w-items-start skt-w-ml-2"
          }`}
        >
          <span
            className={`skt-w skt-w-text-widget-primary skt-w-w-full skt-w-font-medium skt-w-overflow-hidden skt-w-whitespace-nowrap skt-w-text-ellipsis skt-w-flex skt-w-flex-col ${
              rtl
                ? "skt-w-text-right skt-w-items-end"
                : "skt-w-text-left skt-w-items-start"
            } ${small ? "skt-w-text-xs" : "skt-w-text-sm"}`}
          >
            <span>
              {formattedAmount} {token?.symbol}
            </span>
            {refuelEnabled && (
              <span
                className={`skt-w skt-w-text-[10px] skt-w-font-normal skt-w-text-widget-accent ${
                  rtl ? "skt-w-text-right" : "skt-w-text-left"
                }`}
              >
                (+ {formattedRefuelAmount} {refuel?.asset?.symbol})
              </span>
            )}
          </span>
        </div>
      </div>
      <p
        className={`skt-w skt-w-text-xs skt-w-text-widget-secondary skt-w-mt-1 ${
          rtl ? "skt-w-text-right" : "skt-w-text-left"
        }`}
      >
        on {chain?.name}
      </p>
    </div>
  );
};
