import { Network } from "@/utils/types";
import { ReactNode } from "react";

interface ChainDropdownProps {
  networks: Network[];
  activeNetwork: Network;
}
function Option({
  network,
  children,
}: {
  network: Network;
  children?: ReactNode;
}) {
  return (
    <div className="flex gap-1 items-center">
      <img src={network?.icon} />
      <span>{network?.name}</span>
      {children}
    </div>
  );
}
export function ChainDropdown({ networks, activeNetwork }: ChainDropdownProps) {
  return (
    <div>
      <Option network={activeNetwork} />

      <div>
        {networks?.map((network, index) => {
          return !!network ? <Option network={network} key={`${index}-chain`}/> : null;
        })}
      </div>
    </div>
  );
}
