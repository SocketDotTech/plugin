import { useEffect, useState } from "react";
import { Info } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { setSingleTxOnly } from "../../state/quotesSlice";

// components
import { CheckBox } from "../common/CheckBox";
import { Popover } from "../common/Popover";
import { SubTitle } from "./SubTitle";

export const SingleTx = () => {
  const dispatch = useDispatch();
  const singleTxOnlyFromDev = useSelector(
    (state: any) => state.customSettings.singleTxOnly
  );
  const singleTxOnlyFromUser = useSelector(
    (state: any) => state.quotes.singleTxOnly
  );

  const [singleTx, setSingleTx] = useState(singleTxOnlyFromUser);

  // sets the store data and local storage on user input
  useEffect(() => {
    if (singleTx !== singleTxOnlyFromUser) {
      dispatch(setSingleTxOnly(singleTx));
      localStorage.setItem("singleTxOnly", singleTx ? "true" : "false");
    }
  }, [singleTx]);

  if (singleTxOnlyFromDev) return null;
  return (
    <div className="skt-w skt-w-flex skt-w-items-center skt-w-relative skt-w-mt-6 skt-w-justify-between">
      <div className="skt-w skt-w-flex skt-w-items-center skt-w-mb-1.5">
        <SubTitle>Single Transaction Mode</SubTitle>
        <Popover
          content="Only select routes with one user transaction i.e. direct bridge or source chain swap + bridge."
          classNames="skt-w-bottom-8"
          cursor="cursor-help"
        >
          <Info className="skt-w-ml-1.5 skt-w-w-4 skt-w-h-4 skt-w-text-widget-secondary" />
        </Popover>
      </div>
      <span className="skt-w-px-1"></span>
      <CheckBox
        small
        id="singleTx"
        isChecked={singleTx}
        setIsChecked={setSingleTx}
      />
    </div>
  );
};
