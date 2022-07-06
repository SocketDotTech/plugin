import useClickOutside from "../hooks/useClickOutside";
import { Network } from "@/utils/types";
import { ReactNode, useContext, useState } from "react";
import { useEffect } from "react";
import { ChevronDown } from "react-feather";
import { CustomizeContext } from "./CustomizeProvider";

interface ChainDropdownProps {
  networks: Network[];
  activeNetworkId: number;
  onChange: (network: Network) => void;
}

function Option({
  network,
  children,
  onClick,
  selected = false,
  borderRadius = 1,
}: {
  network: Network;
  children?: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  borderRadius?: number;
}) {
  return (
    <div
      className="flex gap-1 items-center cursor-pointer rounded"
      onClick={onClick}
    >
      <img
        src={network?.icon}
        className="h-6 w-6"
        style={{ borderRadius: `calc(0.3rem * ${borderRadius})` }}
      />
      <span className="text-sm text-widget-primary">{network?.name}</span>
      {selected && <ChevronDown className="text-widget-secondary w-4 h-4" />}
      {children}
    </div>
  );
}

export function ChainSelect({
  networks,
  activeNetworkId,
  onChange,
}: ChainDropdownProps) {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const chainDropdownRef = useClickOutside(() => setOpenDropdown(false));
  const [filteredNetworks, setFilteredNetworks] = useState<Network[]>(null);
  const activeNetwork = networks?.filter(
    (x: Network) => x?.chainId === activeNetworkId
  )[0];
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  useEffect(() => {
    setFilteredNetworks(
      networks?.filter((x: Network) => x?.chainId !== activeNetworkId)
    );
  }, [networks, activeNetworkId, activeNetwork]);

  return (
    <div
      onClick={() => setOpenDropdown(!openDropdown)}
      className="relative"
      ref={chainDropdownRef}
    >
      <Option network={activeNetwork} selected borderRadius={borderRadius} />

      {openDropdown && (
        <div className="z-10 absolute bg-white p-2 rounded-lg gap-1 flex flex-col w-40 max-h-60 overflow-y-auto overflow-hidden">
          {filteredNetworks?.map((network, index) => {
            return !!network ? (
              <Option
                network={network}
                key={`${index}-chain`}
                onClick={() => onChange(network)}
                borderRadius={borderRadius}
              />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
