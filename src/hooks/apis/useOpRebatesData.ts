import useSWR from "swr";
const URL = process.env.REACT_APP_LOKI_BASE_URL;

const fetcher = async (url: string) =>
  await fetch(url, {
    headers: {
      "API-KEY": process.env.NEXT_PUBLIC_SOCKET_API_KEY,
    },
  }).then((res) => res.json());

export const useOpRebatesData = ({ address }: { address: string }) => {
  let query = `${URL}/get-claim-data?address=${address}`;

  const { data, error } = useSWR(!!address ? query : null, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    data: data?.result,
    error: error,
  };
};
