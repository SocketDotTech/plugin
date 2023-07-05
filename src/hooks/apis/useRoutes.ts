import { time } from "../../consts/time";
import { SortOptions, Token } from "@socket.tech/socket-v2-sdk";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { socket } from "../apis";

// Main hook that takes in params and fetches the quotes.
export const useRoutes = (
  sourceToken,
  destToken,
  amount,
  sort: SortOptions,
  userAddress,
  refuelEnabled,
  includeBridges,
  excludeBridges,
  singleTxOnly,
  swapSlippage
) => {
  const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);
  const shouldFetch =
    !!sourceToken &&
    !!destToken &&
    !!amount &&
    amount !== "0" &&
    !!userAddress &&
    !isTxModalOpen;

  async function fetchQuotes(
    sourceToken: Token,
    destToken: Token,
    amount: string,
    userAddress: string,
    sort: SortOptions,
    bridgeWithGas,
    includeBridges,
    excludeBridges,
    singleTxOnly,
    swapSlippage
  ) {
    const { routes: quotes } = await socket.getAllQuotes(
      {
        path: { fromToken: sourceToken, toToken: destToken },
        amount,
        address: userAddress,
      },
      {
        sort,
        bridgeWithGas,
        includeBridges,
        excludeBridges,
        singleTxOnly,
        defaultSwapSlippage: swapSlippage,
      }
    );
    return quotes;
  }

  const { data, error, isValidating } = useSWR(
    shouldFetch
      ? [
          sourceToken,
          destToken,
          amount,
          userAddress,
          sort,
          refuelEnabled,
          includeBridges,
          excludeBridges,
          singleTxOnly,
          swapSlippage,
          "quotes",
        ]
      : null,
    fetchQuotes,
    {
      refreshInterval: time.QUOTES_REFRESH * 1000, //refresh quotes every 60 seconds
      revalidateOnFocus: false,
    }
  );

  return {
    data: data,
    isQuotesLoading: userAddress && ((!data && !error) || isValidating),
  };
};
