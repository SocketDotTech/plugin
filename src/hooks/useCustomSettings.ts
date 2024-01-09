import { WidgetProps } from "../types";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  setCustomDestNetworks,
  setCustomSourceNetworks,
  setDefaultDestNetwork,
  setDefaultSourceNetwork,
  setDefaultSourceToken,
  setDefaultDestToken,
  setSameChainSwaps,
  setIncludeBridges,
  setExludeBridges,
  setSingleTxOnly,
  setApiKey,
  setFeeParams,
  setHideIntegratorFee,
  setInitialAmount,
  setZpHide
} from "../state/customSettingsSlice";
import {
  setSingleTxOnly as setSingleTxOnlyFromUser,
  setSortPref,
} from "../state/quotesSlice";
import { formatRGB } from "../utils";

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
    enableSameChainSwaps,
    includeBridges,
    excludeBridges,
    defaultSortPreference,
    singleTxOnly,
    feeParams,
    API_KEY,
    hideIntegratorFee,
    initialAmount,
    zpHide
  } = props;
  const dispatch = useDispatch();
  const firstRender = useRef(true);

  useEffect(() => {
    sourceNetworks && dispatch(setCustomSourceNetworks(sourceNetworks));
    destNetworks && dispatch(setCustomDestNetworks(destNetworks));
    defaultSourceNetwork &&
      dispatch(setDefaultSourceNetwork(defaultSourceNetwork));
    defaultDestNetwork && dispatch(setDefaultDestNetwork(defaultDestNetwork));
    defaultSourceToken && dispatch(setDefaultSourceToken(defaultSourceToken));
    defaultDestToken && dispatch(setDefaultDestToken(defaultDestToken));
    dispatch(setSameChainSwaps(enableSameChainSwaps));
    includeBridges?.length > 0 && dispatch(setIncludeBridges(includeBridges));
    !includeBridges &&
      excludeBridges?.length > 0 &&
      dispatch(setExludeBridges(excludeBridges));
    dispatch(setSingleTxOnly(singleTxOnly));
    
    // This code is executed only on first render
    // This is done so that the values are not updated or reset to default value
    // due to network or account updates
    if(firstRender.current){
      defaultSortPreference && dispatch(setSortPref(defaultSortPreference));
      initialAmount && dispatch(setInitialAmount(initialAmount))

      firstRender.current = false
    }

    if (feeParams?.feePercent && feeParams?.feeTakerAddress) {
      dispatch(setFeeParams(feeParams));
      hideIntegratorFee && dispatch(setHideIntegratorFee(hideIntegratorFee));
    }

    // if singleTxOnly is set to true in the plugin config,
    // additionally set the in-plugin singleTxOnly value to true
    if (singleTxOnly) {
      dispatch(setSingleTxOnlyFromUser(singleTxOnly));
      localStorage.setItem("singleTxOnly", singleTxOnly ? "true" : "false");
    }

    if (API_KEY) {
      dispatch(setApiKey(API_KEY));
    }

    dispatch(setZpHide(zpHide));
  }, [props]);

  // Theme
  useEffect(() => {
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
    customize?.fontFamily &&
      document.documentElement.style.setProperty(
        "--socket-widget-font-family",
        customize.fontFamily
      );
  }, [customize]);
};
