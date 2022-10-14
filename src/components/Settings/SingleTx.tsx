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
    <div className="skt-w flex items-center relative mt-6 justify-between">
      <div className="skt-w flex items-center mb-1.5">
        <SubTitle>Single Transaction Mode</SubTitle>
        <Popover
          content="Only select routes with one user transaction i.e. direct bridge or source chain swap + bridge."
          classNames="bottom-8"
          cursor="cursor-help"
        >
          <Info className="ml-1.5 w-4 h-4 text-widget-secondary" />
        </Popover>
      </div>
      <span className="px-1"></span>
      <CheckBox
        small
        id="singleTx"
        isChecked={singleTx}
        setIsChecked={setSingleTx}
      />
    </div>
  );
};
