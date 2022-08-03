import { Check } from "react-feather";

interface StepperProps {
  currentTx: number;
  userTxs: [];
}
export const Stepper = (props: StepperProps) => {
  const { currentTx, userTxs } = props;
  return (
    <div className="flex">
      {userTxs?.map((x, index) => {
        return (
          <Step
            active={currentTx === index}
            lastItem={index === userTxs?.length - 1}
            key={index}
            completed={currentTx > index}
          />
        );
      })}
    </div>
  );
};

const Step = (props: {
  active?: boolean;
  completed?: boolean;
  lastItem?: boolean;
}) => {
  const { active, completed, lastItem } = props;
  return (
    <div
      className={`flex flex-row items-center ${!lastItem ? "flex-grow" : ""}`}
    >
      {/* circle */}
      <span
        className={`relative z-10 w-4 h-4 rounded-full flex justify-center items-center ${
          completed ? "bg-widget-accent border-0" : ""
        } ${
          active
            ? "border-2 border-widget-accent"
            : "border border-widget-secondary-text"
        } `}
      >
        {completed && <Check className="text-widget-onAccent w-3 h-3" />}
      </span>
      {/* line */}
      {!lastItem && (
        <span
          className={`h-px flex-grow ${
            completed ? "bg-widget-accent" : "bg-widget-secondary-text"
          }`}
        ></span>
      )}
    </div>
  );
};
