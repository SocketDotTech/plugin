import { Route } from "@socket.tech/socket-v2-sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export const useGetGasLimitFromUserTxs = (route: Route, chainId: number) => {
  const [totalGasLimit, setTotalGasLimit] = useState<string>("");

  useEffect(() => {
    if (route && chainId) {
      const gasLimit = route?.userTxs.reduce((acc, curr) => {
        if (curr.chainId === chainId) {
          return acc.add(ethers.BigNumber.from(curr.gasFees?.gasLimit) || 0);
        }
        return acc;
      }, ethers.BigNumber.from(0));

      setTotalGasLimit(gasLimit.toString());
    }
  }, [route, chainId]);

  return totalGasLimit;
};
