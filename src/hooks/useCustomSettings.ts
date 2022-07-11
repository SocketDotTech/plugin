import { WidgetProps } from "../utils/types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCustomDestNetworks, setCustomSourceNetworks } from "../state/customSettingsSlice";

// To set custom chains, tokens, default values passed as props
export const useCustomSettings = (props: WidgetProps) => {
  const { sourceNetworks, destNetworks } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCustomSourceNetworks(sourceNetworks));
  }, [sourceNetworks]);

  useEffect(() => {
    dispatch(setCustomDestNetworks(destNetworks))
  }, [destNetworks]);
};
