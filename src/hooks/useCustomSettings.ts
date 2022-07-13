import { WidgetProps } from "../types";
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
  setDefaultDestToken,
} from "../state/customSettingsSlice";
import { formatRGB } from "../utils";

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
    sourceTokens && dispatch(setCustomSourceTokens(sourceTokens));
  }, [sourceTokens]);

  useEffect(() => {
    destTokens && dispatch(setCustomDestTokens(destTokens));
  }, [destTokens]);

  useEffect(() => {
    defaultSourceToken && dispatch(setDefaultSourceToken(defaultSourceToken));
  }, [defaultSourceToken]);

  useEffect(() => {
    defaultDestToken && dispatch(setDefaultDestToken(defaultDestToken));
  }, [defaultDestToken]);

  // Theme
  useEffect(() => {
    console.log("customize", customize);
    customize?.accent &&
      document.documentElement.style.setProperty(
        "--socket-widget-accent-color",
        formatRGB(customize.accent)
      );
    customize?.onAccent &&
      document.documentElement.style.setProperty(
        "--socket-widget-on-accent-color",
        formatRGB(customize.onAccent)
      );
    customize?.primary &&
      document.documentElement.style.setProperty(
        "--socket-widget-primary-color",
        formatRGB(customize.primary)
      );
    customize?.secondary &&
      document.documentElement.style.setProperty(
        "--socket-widget-secondary-color",
        formatRGB(customize.secondary)
      );
    customize?.text &&
      document.documentElement.style.setProperty(
        "--socket-widget-primary-text-color",
        formatRGB(customize.text)
      );
    customize?.secondaryText &&
      document.documentElement.style.setProperty(
        "--socket-widget-secondary-text-color",
        formatRGB(customize.secondaryText)
      );
    customize?.interactive &&
      document.documentElement.style.setProperty(
        "--socket-widget-interactive",
        formatRGB(customize.interactive)
      );
    customize?.onInteractive &&
      document.documentElement.style.setProperty(
        "--socket-widget-on-interactive",
        formatRGB(customize.onInteractive)
      );
  }, [customize]);
};
