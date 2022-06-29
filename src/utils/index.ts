import { ethers } from "ethers";
import { SOCKET_API_KEY } from "../consts";

export const fetcher = async (url: string) =>
  fetch(url, {
    headers: {
      "API-KEY": SOCKET_API_KEY,
    },
  }).then((res) => res.json());

export const formatCurrencyAmount = (
  value: number | string,
  units: number,
  decimals?: number
) => {
  const result = !!value
    ? ethers.utils.formatUnits(value?.toString(), units)
    : "";
  if (result == "0.0" || !result) return 0;

  if (!!decimals) return truncateDecimalValue(result, decimals);

  return result;
};

export const truncateDecimalValue = (
  value: number | string,
  decimals: number
) => {
  // truncate upto number of decimals
  const re = new RegExp("^-?\\d+(?:.\\d{0," + (decimals || -1) + "})?", "g");
  return value.toString().match(re)?.[0];
};
