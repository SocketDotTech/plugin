import useSWR from "swr";

const fetcher = async (url: string, API_KEY: string) =>
  await fetch(url, {
    headers: {
      "API-KEY": API_KEY,
    },
  }).then((res) => res.json());

export const useOpRebatesData = ({
  address,
  tokenAddress,
  toChainId,
  API_KEY,
}: {
  address: string;
  tokenAddress: string;
  toChainId: number;
  API_KEY: string;
}) => {
  let query = `https://microservices.socket.tech/loki/rewards/get-claim-data?address=${address}&chainId=${toChainId}&token=${tokenAddress}`;

  const { data, error } = useSWR(
    !!address && !!API_KEY ? [query, API_KEY, "get-claim"] : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data: data?.result,
    error: error,
  };
};
