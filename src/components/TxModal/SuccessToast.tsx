import { CustomizeContext } from "../../providers/CustomizeProvider";
import { useContext } from "react";
import { CheckCircle } from "react-feather";
import { animated, useSpring } from "@react-spring/web";

export const SuccessToast = () => {
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  const animationProps = useSpring({
    from: { bottom: -100, opacity: 0 },
    to: { bottom: 12, opacity: 1 },
  });

  return (
    <animated.div
      className="skt-w bg-widget-accent text-widget-onAccent p-4 flex items-center absolute left-3 right-3"
      style={{
        borderRadius: `calc(0.625rem * ${borderRadius})`,
        ...animationProps,
      }}
    >
      <CheckCircle className="skt-w mr-3 text-widget-onAccent" /> Transaction is
      complete
    </animated.div>
  );
};
