import { WidgetProps } from "../types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setCustomDestNetworks,
  setCustomSourceNetworks,
  setDefaultDestNetwork,
  setDefaultSourceNetwork,
  setDefaultSourceToken,
  setDefaultDestToken,
} from "../state/customSettingsSlice";

// To set custom chains, tokens, default values passed as props
export const useCustomSettings = (props: WidgetProps) => {
  const {
    sourceNetworks,
    destNetworks,
    defaultSourceNetwork,
    defaultDestNetwork,
    defaultSourceToken,
    defaultDestToken,
    customize,
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
    defaultSourceToken && dispatch(setDefaultSourceToken(defaultSourceToken));
  }, [defaultSourceToken]);

  useEffect(() => {
    defaultDestToken && dispatch(setDefaultDestToken(defaultDestToken));
  }, [defaultDestToken]);

  // Theme
  useEffect(() => {
    customize?.accent &&
      document.documentElement.style.setProperty(
        "--socket-widget-accent-color",
        customize.accent
      );
    customize?.onAccent &&
      document.documentElement.style.setProperty(
        "--socket-widget-on-accent-color",
        customize.onAccent
      );
    customize?.primary &&
      document.documentElement.style.setProperty(
        "--socket-widget-primary-color",
        customize.primary
      );
    customize?.secondary &&
      document.documentElement.style.setProperty(
        "--socket-widget-secondary-color",
        customize.secondary
      );
    customize?.text &&
      document.documentElement.style.setProperty(
        "--socket-widget-primary-text-color",
       customize.text
      );
    customize?.secondaryText &&
      document.documentElement.style.setProperty(
        "--socket-widget-secondary-text-color",
        customize.secondaryText
      );
    customize?.interactive &&
      document.documentElement.style.setProperty(
        "--socket-widget-interactive",
        customize.interactive
      );
    customize?.onInteractive &&
      document.documentElement.style.setProperty(
        "--socket-widget-on-interactive",
        customize.onInteractive
      );
  }, [customize]);
};
