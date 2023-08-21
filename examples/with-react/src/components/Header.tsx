export const Header = () => {
  return (
    <div className="flex justify-between items-center w-full px-5 border-b border-b-slate-300/10 h-[70px]">
      <p className="text-white font-medium text-lg">Socket Plugin</p>

      <div className="flex items-center">
        <a
          href="https://sockettech.notion.site/Socket-Widget-Docs-b905871870e343c6833169ebbd356790"
          target="_blank"
          className="text-sm font-medium text-white hover:text-sky-400 mr-8"
        >
          Docs
        </a>
        <button className="rounded-md bg-slate-400/10 px-3 py-2 font-medium text-sm highlight-white/5 text-white hover:bg-slate-400/20">
          Connect Wallet
        </button>
      </div>
    </div>
  );
};
