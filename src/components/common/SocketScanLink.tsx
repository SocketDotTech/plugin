import { ExternalLink } from "react-feather";

export const SocketScanLink = ({ txHash }: { txHash: string }) => {
  if (!txHash) return null;

  return (
    <a
      className="skt-w skt-w-button skt-w-text-sm skt-w-text-widget-secondary hover:skt-w-text-widget-primary skt-w-text-center skt-w-mb-2 skt-w-flex skt-w-items-center skt-w-no-underline skt-w-justify-center"
      href={`https://socketscan.io/tx/${txHash}`}
      target="_blank"
    >
      Track this transaction on SocketScan{" "}
      <ExternalLink className="skt-w-w-[18px] skt-w-h-[18px] skt-w-ml-1" />
    </a>
  );
};
