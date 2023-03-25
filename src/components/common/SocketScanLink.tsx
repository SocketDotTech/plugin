import { ExternalLink } from "react-feather";

export const SocketScanLink = ({ txHash }: { txHash: string }) => {
  if (!txHash) return null;

  return (
    <a
      className="skt-w skt-w-button text-sm text-widget-secondary hover:text-widget-primary text-center mb-2 flex items-center no-underline justify-center"
      href={`https://socketscan.io/tx/${txHash}`}
      target="_blank"
    >
      Track this transaction on SocketScan{" "}
      <ExternalLink className="w-[18px] h-[18px] ml-1" />
    </a>
  );
};
