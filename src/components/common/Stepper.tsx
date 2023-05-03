import { Check } from "react-feather";

interface StepperProps {
  currentTx: number;
  userTxs: [];
}
export const Stepper = (props: StepperProps) => {
  const { currentTx, userTxs } = props;
  return (
    <div className="skt-w skt-w-flex">
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
      className={`skt-w skt-w-flex skt-w-flex-row skt-w-items-center ${
        !lastItem ? "skt-w-flex-grow" : ""
      }`}
    >
      {/* circle */}
      <span
        className={`skt-w skt-w-relative skt-w-w-4 skt-w-h-4 skt-w-rounded-full skt-w-flex skt-w-justify-center skt-w-items-center ${
          completed ? "skt-w-bg-widget-accent skt-w-border-0" : ""
        } ${
          active
            ? "skt-w-border-2 skt-w-border-widget-accent"
            : "skt-w-border skt-w-border-widget-secondary-text skt-w-border-opacity-40"
        } `}
      >
        {completed && (
          <Check className="skt-w skt-w-text-widget-onAccent skt-w-w-3 skt-w-h-3" />
        )}
      </span>
      {/* line */}
      {!lastItem && (
        <span
          className={`skt-w skt-w-h-px skt-w-flex-grow ${
            completed
              ? "skt-w-bg-widget-accent"
              : "skt-w-bg-widget-secondary-text skt-w-bg-opacity-40"
          }`}
        ></span>
      )}
    </div>
  );
};
