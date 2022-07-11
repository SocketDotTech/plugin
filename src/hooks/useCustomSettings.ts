import { WidgetProps } from "../utils/types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setCustomDestNetworks,
  setCustomSourceNetworks,
  setDefaultDestNetwork,
  setDefaultSourceNetwork,
  setCustomSourceTokens,
  setCustomDestTokens,
  setDefaultSourceToken,
  setDefaultDestToken
} from "../state/customSettingsSlice";

// To set custom chains, tokens, default values passed as props
export const useCustomSettings = (props: WidgetProps) => {
  const {
    sourceNetworks,
    destNetworks,
    defaultSourceNetwork,
    defaultDestNetwork,
    sourceTokens,
    destTokens,
    defaultSourceToken,
    defaultDestToken
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

  useEffect(() => {
    sourceTokens && dispatch(setCustomSourceTokens(sourceTokens));
  }, [sourceTokens]);

  useEffect(() => {
    destTokens && dispatch(setCustomDestTokens(destTokens));
  }, [destTokens]);

  useEffect(() => {
    defaultSourceToken && dispatch(setDefaultSourceToken(defaultSourceToken));
  }, [defaultSourceToken])

  useEffect(() => {
    defaultDestToken && dispatch(setDefaultDestToken(defaultDestToken));
  }, [defaultDestToken])
};
