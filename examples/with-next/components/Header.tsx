import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => {
  return (
    <div className="flex justify-between items-center w-full px-7 border-b border-b-slate-300/10 h-[70px]">
      <p className="text-white font-medium text-lg">Socket Plugin</p>

      <div className="flex items-center">
        <a
          href="https://sockettech.notion.site/Socket-Widget-Docs-b905871870e343c6833169ebbd35fea6790"
          target="_blank"
          className="text-sm font-medium text-white hover:text-sky-400 mr-8"
        >
          Docs
        </a>
        <ConnectButton />
      </div>
    </div>
  );
};