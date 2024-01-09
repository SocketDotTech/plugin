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
  const networkDisplayName = network?.chainId === 1101 ? 'zkEVM' : network?.chainId === 324 ? 'zkSync' : network?.name;
  return (
    <div
      className={`skt-w skt-w-flex skt-w-w-[140px] skt-w-items-center skt-w-cursor-pointer skt-w-flex-shrink-0 ${
        selected
          ? ""
          : "skt-w-p-1.5 hover:skt-w-bg-widget-secondary hover:skt-w-bg-opacity-80"
      }`}
      onClick={onClick}
    >
      <div className="skt-w skt-w-flex skt-w-items-center">
        <img
          src={network?.icon}
          className="skt-w skt-w-h-6 skt-w-w-6"
          style={{ borderRadius: `calc(0.3rem * ${borderRadius})` }}
        />
        <span className="skt-w skt-w-text-sm skt-w-text-widget-primary skt-w-mx-1">
          {networkDisplayName}
        </span>
      </div>
      {selected && !onlyOneNetwork && (
        <ChevronDown className="skt-w skt-w-text-widget-secondary skt-w-w-4 skt-w-h-4" />
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
      className={`skt-w skt-w-relative skt-w-p-1.5 ${
        openDropdown ? "skt-w-bg-widget-interactive skt-w-h-auto" : ""
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
          className="skt-w-block skt-w skt-w-text-sm skt-w-text-widget-primary skt-w-bg-widget-secondary skt-w-py-1.5 skt-w-px-2 skt-w-animate-pulse skt-w-w-[120px] skt-w-h-6"
          style={{ borderRadius: `calc(1rem * ${borderRadius})` }}
        />
      )}

      {openDropdown && (
        <div
          className="skt-w skt-w-pt-1 skt-w-z-10 skt-w-left-0 skt-w-absolute skt-w-bg-widget-interactive skt-w-flex skt-w-flex-col skt-w-w-full skt-w-max-h-[150px] skt-w-overflow-y-auto skt-w-overflow-hidden"
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
