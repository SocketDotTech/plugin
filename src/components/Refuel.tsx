import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckBox } from "./common/CheckBox";
import { enableRefuel } from "../state/quotesSlice";
import { CustomizeContext } from "../providers/CustomizeProvider";
import useMappedChainData from "../hooks/useMappedChainData";
import { HelpCircle } from "react-feather";
import { Tooltip } from "./common/Tooltip";

export const Refuel = ({ selectivelyShowRefuel }) => {
  const [isChecked, setIsChecked] = useState(false);
  const destChainId = useSelector((state: any) => state.networks.destChainId);
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const mappedChainData = useMappedChainData();
  const dispatch = useDispatch();

  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  useEffect(() => {
    dispatch(enableRefuel(isChecked));
  }, [isChecked]);

  useEffect(() => {
    if (destChainId === 1 || destChainId === sourceChainId) {
      setIsChecked(false);
      dispatch(enableRefuel(false));
    }
  }, [destChainId]);

  if (
    selectivelyShowRefuel &&
    (destChainId === 1 || destChainId === sourceChainId)
  )
    return null;

  return (
    <div
      className="skt-w skt-w-flex skt-w-bg-widget-secondary skt-w-py-3 skt-w-pl-4 skt-w-pr-3 skt-w-justify-between skt-w-mt-6 skt-w-items-center skt-w-relative"
      style={{ borderRadius: `calc(0.5rem * ${borderRadius})` }}
    >
      <div className="skt-w-mr-1">
        <div className="skt-w skt-w-text-sm skt-w-text-widget-primary skt-w-font-medium skt-w-flex skt-w-items-center">
          Enable Refuel
          <Tooltip tooltipContent="With Refuel, you can swap native tokens on the source chain for native tokens to transact on the destination chain">
            <HelpCircle className="skt-w skt-w-ml-1.5 skt-w-w-4 skt-w-h-4 skt-w-opacity-70" />
          </Tooltip>
        </div>
        <p className="skt-w skt-w-text-xs skt-w-text-widget-secondary skt-w-mt-0.5">
          {destChainId === 1 ? (
            <span className="skt-w skt-w-text-red-500">
              Refuel isn't supported on Ethereum
            </span>
          ) : destChainId === sourceChainId ? (
            <span className="skt-w skt-w-text-red-500">
              Refuel isn't supported for same chain swaps
            </span>
          ) : (
            `Get Gas for transactions on ${mappedChainData?.[destChainId]?.name}`
          )}
        </p>
      </div>
      <CheckBox
        id="refuel-checkbox"
        small
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        disabled={destChainId === 1 || destChainId === sourceChainId}
      />
    </div>
  );
};
