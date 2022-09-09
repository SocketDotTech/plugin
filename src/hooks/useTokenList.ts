// Fetches token lists based on source chain and dest chain.
import { Currency } from "../types";
import { socket } from "./apis";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { useCallback } from "react";

export const useTokenList = (customTokenList?: string | Currency[]) => {
  const isURL = typeof customTokenList === "string";
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const destChainId = useSelector((state: any) => state.networks.destChainId);

  // If token list url is passed, fetch the token list
  const fetcher = useCallback(
    async (url) =>
      fetch(url, { credentials: "omit" }).then((res) => res.json()),
    [customTokenList]
  );
  const shouldFetchExternalTokenList =
    isURL && !!sourceChainId && !!destChainId;
  const { data: customData, error: customFetchError } = useSWR(
    shouldFetchExternalTokenList ? customTokenList : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  // If custom list is not passed, fetch the tokens using socket sdk
  const shouldFetchFromSDK =
    !customTokenList && !!sourceChainId && !!destChainId;
  async function fetchTokens(sourceChainId: number, destChainId: number) {
    try {
      // fetching from the sdk
      const _tokens = await socket.getTokenList({
        fromChainId: sourceChainId,
        toChainId: destChainId,
      });

      // Converting the response into standard token list format
      const standardTokenList = {
        name: "Socket Default",
        tokens:
          sourceChainId === destChainId
            ? [..._tokens?.to?.tokens]
            : [..._tokens?.from?.tokens, ..._tokens?.to?.tokens],
      };
      return standardTokenList;
    } catch (e) {
      throw e;
    }
  }
  const { data: tokensFromSDK, error: errorFromSDK } = useSWR(
    shouldFetchFromSDK ? [sourceChainId, destChainId, "fetching tokens"] : null,
    fetchTokens,
    {
      revalidateOnFocus: false,
    }
  );

  if (customTokenList && !isURL) {
    return customTokenList; // If JSON object is passed instead of a URL, return the custom token list
  } else if (isURL && customData) {
    return customData?.tokens; // Fetched from the url provided
  } else if (!customTokenList && tokensFromSDK) {
    return tokensFromSDK?.tokens; // From SDK
  }
};
