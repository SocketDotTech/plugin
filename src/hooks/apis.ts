import { useEffect } from "react";
import { Socket, Supported } from "socket-v2-sdk";
import { useDispatch, useSelector } from "react-redux";
import { SOCKET_API_KEY } from "../consts";

// redux actions
import { setNetworks } from "../state/networksSlice";
import { setTokens } from "../state/tokensSlice";
import { setQuotes } from "../state/quotesSlice";

const socket = new Socket({
  apiKey: SOCKET_API_KEY,
  defaultQuotePreferences: {
    singleTxOnly: false,
  },
});

export const useChains = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchSupportedNetworks() {
      const supportedNetworks = await Supported.getAllSupportedRoutes();
      dispatch(setNetworks(supportedNetworks?.result));
    }
    fetchSupportedNetworks();
  }, []);
};

export const useTokenList = () => {
  const dispatch = useDispatch();
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const destChainId = useSelector((state: any) => state.networks.destChainId);
  useEffect(() => {
    async function fetchTokens() {
      const tokens = await socket.getTokenList({
        fromChainId: sourceChainId,
        toChainId: destChainId,
      });
      dispatch(setTokens(tokens));
    }

    fetchTokens();
  }, [sourceChainId, destChainId]);
};

export const useRoutes = async (
  sourceToken,
  destToken,
  amount,
  sort: "output" | "gas" | "time"
) => {
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchQuotes() {
      const quotes = await socket.getAllQuotes(
        {
          path: { fromToken: sourceToken, toToken: destToken },
          amount,
          address: "0xF75aAa99e6877fA62375C37c343c51606488cd08",
        },
        { sort: sort ?? "output" }
      );

      dispatch(setQuotes(quotes));
    }
    fetchQuotes();
  }, [sourceToken, destToken, amount]);
};