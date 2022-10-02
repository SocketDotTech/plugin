import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSingleTxOnly } from "../../state/quotesSlice";

// components
import { CheckBox } from "../common/CheckBox";
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
    <div className="skt-w flex items-center relative mt-5">
      <SubTitle>Single Transaction only</SubTitle>
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
