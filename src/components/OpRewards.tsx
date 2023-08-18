import { useContext, useEffect, useState } from "react";
import { Gift, Info } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useTransition } from "@react-spring/web";
import { ethers } from "ethers";

import { setIsOpRewardModalOpen } from "../state/modals";
import { Web3Context } from "../providers/Web3Provider";
import { formatCurrencyAmount, truncateDecimalValue } from "../utils";
import { useOpRebatesData } from "../hooks/apis/useOpRebatesData";

// components
import { Modal } from "./common/Modal";
import { Button } from "./common/Button";
import { Tooltip } from "./common/Tooltip";

export const OpRewards = () => {
  const dispatch = useDispatch();
  const [showRewardsSection, setShowRewardsSection] = useState<boolean>(false);
  const apiKey = useSelector((state: any) => state.customSettings.apiKey);

  const toggleDropdown = (value) => {
    dispatch(setIsOpRewardModalOpen(value));
  };

  const web3Context = useContext(Web3Context);
  const { userAddress } = web3Context.web3Provider;

  const { data } = useOpRebatesData({ address: userAddress, API_KEY: apiKey });

  useEffect(() => {
    if (!!data) {
      const pendingAmountBN = ethers.BigNumber.from(data?.pendingAmount);
      const claimableAmountBN = ethers.BigNumber.from(data?.claimableAmount);
      const zeroBN = ethers.BigNumber.from(0);

      const _hideOpRewards = pendingAmountBN.add(claimableAmountBN).eq(zeroBN);

      setShowRewardsSection(!_hideOpRewards);
    }
  }, [data]);

  if (!showRewardsSection) return null;
  return (
    <button
      onClick={() => toggleDropdown(true)}
      className="skt-w skt-w-button skt-w-input skt-w-flex skt-w-ml-3"
    >
      <Gift className="skt-w skt-w-w-5.5 skt-w-h-5.5 skt-w-text-widget-secondary hover:skt-w-text-widget-primary" />
    </button>
  );
};

export const OpRewardsModal = () => {
  const dispatch = useDispatch();
  const isOpRewardModalOpen = useSelector(
    (state: any) => state.modals.isOpRewardModalOpen
  );
  const apiKey = useSelector((state: any) => state.customSettings.apiKey);

  const web3Context = useContext(Web3Context);
  const { userAddress } = web3Context.web3Provider;

  const transitions = useTransition(isOpRewardModalOpen, {
    from: { y: "100%" },
    enter: { y: "0" },
    leave: { y: "100%" },
    config: { duration: 200 },
    onReset: () => toggleSettingsModal(false),
  });

  const toggleSettingsModal = (value: boolean) => {
    dispatch(setIsOpRewardModalOpen(value));
  };

  const { data } = useOpRebatesData({ address: userAddress, API_KEY: apiKey });

  // rewards earned = pending + claimable amount
  const rewardsEarned =
    data &&
    ethers.BigNumber.from(data?.pendingAmount).add(
      ethers.BigNumber.from(data?.claimableAmount)
    );

  const rewardsEarnedInToken =
    data &&
    formatCurrencyAmount(rewardsEarned?.toString(), data?.asset?.decimals);

  return (
    <>
      {transitions(
        (style, item) =>
          item && (
            <Modal
              title="OP Rewards"
              closeModal={() => toggleSettingsModal(false)}
              style={style}
              classNames="skt-w-z-50"
            >
              <div className="skt-w skt-w-px-3 skt-w-pt-3">
                <div className="skt-w skt-w-text-sm skt-w-text-widget-primary skt-w-font-medium skt-w-flex skt-w-items-center">
                  Rewards Earned{" "}
                  <Tooltip
                    tooltipContent="OP rewards for bridging to Optimism can be claimed on
                      Socketscan"
                  >
                    <Info className="skt-w skt-w-w-4 skt-w-h-4 skt-w-ml-1" />
                  </Tooltip>
                </div>
                <div className="skt-w skt-w-text-widget-secondary stk-w-font-medium skt-w-mb-4 skt-w-mt-2 skt-w-flex skt-w-items-center">
                  <Tooltip tooltipContent={rewardsEarnedInToken}>
                    <span className="skt-w skt-w-pr-1">
                      {truncateDecimalValue(rewardsEarnedInToken, 4)}
                    </span>
                  </Tooltip>
                  {data?.asset?.symbol}{" "}
                  <img
                    src={data?.asset?.logoURI}
                    className="skt-w-w-4 skt-w skt-w-h-4 skt-w-rounded-full skt-w-ml-1.5"
                  />
                </div>
                <Button
                  onClick={() =>
                    window.open("https://socketscan.io/rewards", "_blank")
                  }
                >
                  View Rewards on Socketscan
                </Button>
              </div>
            </Modal>
          )
      )}
    </>
  );
};
