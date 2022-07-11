import { WidgetProps } from "../utils/types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setCustomDestNetworks,
  setCustomSourceNetworks,
  setDefaultDestNetwork,
  setDefaultSourceNetwork,
} from "../state/customSettingsSlice";

// To set custom chains, tokens, default values passed as props
export const useCustomSettings = (props: WidgetProps) => {
  const {
    sourceNetworks,
    destNetworks,
    defaultSourceNetwork,
    defaultDestNetwork,
  } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    sourceNetworks && dispatch(setCustomSourceNetworks(sourceNetworks));
  }, [sourceNetworks]);

  useEffect(() => {
    destNetworks && dispatch(setCustomDestNetworks(destNetworks));
  }, [destNetworks]);

  useEffect(() => {
    defaultSourceNetwork &&
      dispatch(setDefaultSourceNetwork(defaultSourceNetwork));
  }, [defaultSourceNetwork]);

  useEffect(() => {
    defaultDestNetwork && dispatch(setDefaultDestNetwork(defaultDestNetwork));
  }, [defaultDestNetwork]);
};
