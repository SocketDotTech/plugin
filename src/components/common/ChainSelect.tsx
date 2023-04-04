import useClickOutside from "../../hooks/useClickOutside";
import { Network } from "../../types";
import { ReactNode, useContext, useState } from "react";
import { useEffect } from "react";
import { ChevronDown } from "react-feather";
import { CustomizeContext } from "../../providers/CustomizeProvider";

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
  onlyOneNetwork = false,
}: {
  network: Network;
  children?: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  borderRadius?: number;
  onlyOneNetwork?: boolean;
}) {
  return (
    <div
      className={`skt-w flex w-28 items-center cursor-pointer flex-shrink-0 ${
        selected ? "" : "p-1.5 hover:bg-widget-secondary hover:bg-opacity-80"
      }`}
      onClick={onClick}
    >
      <div className="skt-w flex items-center">
        <img
          src={network?.icon}
          className="skt-w h-6 w-6"
          style={{ borderRadius: `calc(0.3rem * ${borderRadius})` }}
        />
        <span className="skt-w text-sm text-widget-primary mx-1">
          {network?.name}
        </span>
      </div>
      {selected && !onlyOneNetwork && (
        <ChevronDown className="skt-w text-widget-secondary w-4 h-4" />
      )}
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
      onClick={
        filteredNetworks?.length === 0
          ? null
          : () => setOpenDropdown(!openDropdown)
      }
      className={`skt-w relative p-1.5 ${
        openDropdown ? "bg-widget-interactive h-auto" : ""
      }`}
      style={{ borderRadius: `calc(0.5rem * ${borderRadius})` }}
      ref={chainDropdownRef}
    >
      {activeNetwork ? (
        <Option
          network={activeNetwork}
          selected
          borderRadius={borderRadius}
          onlyOneNetwork={networks?.length < 2}
        />
      ) : (
        <span
          className="skt-w text-sm text-widget-primary bg-widget-secondary py-1.5 px-2"
          style={{ borderRadius: `calc(0.3rem * ${borderRadius})` }}
        >
          Loading chains
        </span>
      )}

      {openDropdown && (
        <div
          className="skt-w pt-1 z-10 left-0 absolute bg-widget-interactive flex flex-col w-full max-h-[150px] overflow-y-auto overflow-hidden"
          style={{
            borderBottomRightRadius: `calc(0.75rem * ${borderRadius})`,
            borderBottomLeftRadius: `calc(0.75rem * ${borderRadius})`,
          }}
        >
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
