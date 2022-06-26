import useClickOutside from "../hooks/useClickOutside";
import { Network } from "@/utils/types";
import { ReactNode, useState } from "react";
import { useEffect } from "react";

interface ChainDropdownProps {
  networks: Network[];
  activeNetwork: Network;
  onChange: (network: Network) => void;
}

function Option({
  network,
  children,
  onClick,
}: {
  network: Network;
  children?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex gap-1 items-center hover:bg-gray-200 cursor-pointer p-2 rounded"
      onClick={onClick}
    >
      <img src={network?.icon} className="h-6 w-6 rounded" />
      <span>{network?.name}</span>
      {children}
    </div>
  );
}

export function ChainDropdown({
  networks,
  activeNetwork,
  onChange,
}: ChainDropdownProps) {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const chainDropdownRef = useClickOutside(() => setOpenDropdown(false));
  const [filteredNetworks, setFilteredNetworks] = useState<Network[]>(null);

  useEffect(() => {
    setFilteredNetworks(networks?.filter((x: Network) => x?.chainId !== activeNetwork?.chainId));
  }, [networks, activeNetwork]);

  return (
    <div
      onClick={() => setOpenDropdown(!openDropdown)}
      className="relative"
      ref={chainDropdownRef}
    >
      <Option network={activeNetwork} />

      {openDropdown && (
        <div className="absolute bg-white p-2 rounded-lg gap-1 flex flex-col w-40 max-h-60 overflow-y-auto overflow-hidden">
          {filteredNetworks?.map((network, index) => {
            return !!network ? (
              <Option
                network={network}
                key={`${index}-chain`}
                onClick={() => onChange(network)}
              />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
