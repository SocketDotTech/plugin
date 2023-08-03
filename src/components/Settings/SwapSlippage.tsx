import useDebounce from "../../hooks/useDebounce";
import { animated, useTransition } from "@react-spring/web";
import { useEffect, useState } from "react";
import { setSwapSlippage } from "../../state/quotesSlice";

// Components
import { Info } from "react-feather";
import { CustomInputBox } from "../common/CustomInput";
import { RadioCheckbox } from "../common/RadioCheckbox";
import { useDispatch, useSelector } from "react-redux";
import { DisclaimerBox } from "../common/DisclaimerBox";
import { SubTitle } from "./SubTitle";
import { Tooltip } from "../common/Tooltip";

export const SwapSlippage = () => {
  const [buttonInput, setButtonInput] = useState<number | null>(null);
  const [customInput, setCustomInput] = useState<string>("");
  const slippageValues = {
    1: 0.5,
    2: 1,
    3: 3,
  };
  const MIN_SLIPPAGE = 0;
  const MAX_SLIPPAGE = 50;

  const swapSlippage = useSelector((state: any) => state.quotes.swapSlippage);
  const dispatch = useDispatch();

  // if the swap slippage is one of the slippageValues, check the relevant checkbox,
  // else fill the custom input box
  useEffect(() => {
    if (Object.values(slippageValues).includes(swapSlippage)) {
      setButtonInput(swapSlippage);
    } else {
      setCustomInput(swapSlippage);
    }
  }, []);

  function handleButtonInput(value: number) {
    setCustomInput("");
    setButtonInput(value);
  }

  function handleCustomInput(value: string) {
    setButtonInput(null);
    let _value;
    if (Number(value) < 0) {
      _value = "0";
    } else if (value && value.indexOf(".") > -1) {
      // if it's a decimal value, restrict the deimal upto 3 places.
      if (value.split(".")[1].length <= 2) {
        _value = value;
      }
    } else _value = value;

    setCustomInput(_value ?? customInput);
  }

  //   For transition
  const [showLowSlippageDisclaimer, setShowLowSlippageDisclaimer] =
    useState<boolean>(false);
  const [showInputLimitDisclaimer, setInputLimitDisclaimer] =
    useState<boolean>(false);

  const lowSlippageTransition = useTransition(showLowSlippageDisclaimer, {
    from: { opacity: 0, y: "10px" },
    enter: { opacity: 1, y: "0px" },
    leave: { opacity: 0, y: "10px" },
    delay: showInputLimitDisclaimer ? 200 : 0,
    config: { duration: 50 },
  });

  const inputLimitTransition = useTransition(showInputLimitDisclaimer, {
    from: { opacity: 0, y: "10px" },
    enter: { opacity: 1, y: "0px" },
    leave: { opacity: 0, y: "10px" },
    delay: showInputLimitDisclaimer ? 200 : 0,
    config: { duration: 50 },
  });

  useDebounce(
    () => {
      if (customInput || buttonInput) {
        const _value = buttonInput ?? Number(customInput);
        // if value is within the range, dispatch it
        if (_value > MIN_SLIPPAGE && _value <= MAX_SLIPPAGE) {
          setInputLimitDisclaimer(false);
          dispatch(setSwapSlippage(_value));
          localStorage.setItem("swapSlippage", `${_value}`);

          // if value is between 0 and 1 (excluding 0), show the low slippage disclaimer
          setShowLowSlippageDisclaimer(_value > 0 && _value < 1);
        } else {
          setShowLowSlippageDisclaimer(false);
          setInputLimitDisclaimer(true);
        }
      }
    },
    300,
    [customInput, buttonInput]
  );

  return (
    <div className="skt-w-mt-6">
      <div className="skt-w-flex skt-w-justify-between skt-w-relative">
        <div className="skt-w skt-w-flex skt-w-items-center skt-w-mb-1.5">
          <SubTitle>Swap Slippage</SubTitle>
          <Tooltip tooltipContent="Your swap transaction will revert if the price changes unfavourably by more than this percentage.">
            <Info className="skt-w-ml-1.5 skt-w-w-4 skt-w-h-4 skt-w-text-widget-secondary" />
          </Tooltip>
        </div>
        {buttonInput || customInput ? (
          <span className="skt-w-text-xs skt-w-text-widget-secondary skt-w-ml-3">
            Slippage: {buttonInput ?? customInput}%
          </span>
        ) : null}
      </div>
      <div className="skt-w-flex skt-w-w-full">
        <RadioCheckbox
          id="swap-slippage-1"
          name="swap-slippage"
          label={`${slippageValues[1]}%`}
          checked={buttonInput === slippageValues[1]}
          onChange={() => handleButtonInput(slippageValues[1])}
        />
        <RadioCheckbox
          id="swap-slippage-2"
          name="swap-slippage"
          label={`${slippageValues[2]}%`}
          checked={buttonInput === slippageValues[2]}
          onChange={() => handleButtonInput(slippageValues[2])}
        />
        <RadioCheckbox
          id="swap-slippage-3"
          name="swap-slippage"
          label={`${slippageValues[3]}%`}
          checked={buttonInput === slippageValues[3]}
          onChange={() => handleButtonInput(slippageValues[3])}
        />
        <CustomInputBox
          value={customInput}
          onChange={(e) => handleCustomInput(e)}
        />
      </div>

      {lowSlippageTransition(
        (styles, item) =>
          item && (
            <animated.div style={styles}>
              <DisclaimerBox>
                Transactions with extremely low slippage tolerance might be
                reverted because of very small market movement
              </DisclaimerBox>
            </animated.div>
          )
      )}

      {/* Input off limit disclaimer */}
      {inputLimitTransition(
        (styles, item) =>
          item && (
            <animated.div style={styles}>
              <DisclaimerBox>
                Please input a value greater than 0 and less than 50
              </DisclaimerBox>
            </animated.div>
          )
      )}
    </div>
  );
};
