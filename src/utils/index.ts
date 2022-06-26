import { SOCKET_API_KEY } from "../consts";

export const fetcher = async (url: string) =>
  fetch(url, {
    headers: {
      "API-KEY": SOCKET_API_KEY,
    },
  }).then((res) => res.json());
