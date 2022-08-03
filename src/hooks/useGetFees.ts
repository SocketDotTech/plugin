import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { formatCurrencyAmount } from "../utils";
import { useGasPrice } from "./apis";

export const useGetFees = (
  gasLimit: string,
  chainId: number,
  decimals: number,
  route: any,
) => {
  const [feesInToken, setFeesInToken] = useState<string>("");
  const [feesInUsd, setFeesInUsd] = useState<number>(0);
  const gasPrice = useGasPrice(chainId);

  useEffect(() => {
    const amount =
      !!gasLimit &&
      !!gasPrice?.data &&
      ethers.BigNumber.from(gasLimit)
        .mul(ethers.BigNumber.from(gasPrice?.data.normal.gasPrice))
        .toString();

    if (!!amount && !!decimals) {
      const amountInToken = formatCurrencyAmount(amount, decimals).toString();
      setFeesInToken(amountInToken);
    }

    if (route && chainId) {
      const totalFeesInUsd = route?.userTxs.reduce((acc, curr) => {
        if (curr.chainId === chainId) {
          return acc + (curr.gasFees?.feesInUsd ?? 0);
        }
        return acc;
      }, 0);

      setFeesInUsd(totalFeesInUsd);
    }
  }, [gasPrice, gasLimit]);

  return { feesInToken, feesInUsd };
};
