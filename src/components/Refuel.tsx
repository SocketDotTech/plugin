import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckBox } from "./common/CheckBox";
import { enableRefuel } from "../state/quotesSlice";
import { CustomizeContext } from "../providers/CustomizeProvider";
import useMappedChainData from "../hooks/useMappedChainData";
import { Info } from "react-feather";

export const Refuel = () => {
  const [isChecked, setIsChecked] = useState(false);
  const destChainId = useSelector((state: any) => state.networks.destChainId);
  const mappedChainData = useMappedChainData();
  const dispatch = useDispatch();

  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  useEffect(() => {
    dispatch(enableRefuel(isChecked));
  }, [isChecked]);

  useEffect(() => {
    if (destChainId === 1) {
      setIsChecked(false);
      dispatch(enableRefuel(false));
    }
  }, [destChainId]);

  return (
    <div
      className="flex gap-1 bg-widget-secondary py-3 pl-4 pr-3 justify-between mt-6 items-center"
      style={{ borderRadius: `calc(0.5rem * ${borderRadius})` }}
    >
      <div>
        <p className="text-sm text-widget-primary font-medium flex items-center">Enable Refuel <Info className="ml-1.5 w-3.5 h-3.5 opacity-70"/></p>
        <p className="text-xs text-widget-secondary mt-0.5">
          {destChainId === 1 ? (
            <span className="text-red-500">
              Refuel isn't supported on Ethereum
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
        disabled={destChainId === 1}
      />
    </div>
  );
};
