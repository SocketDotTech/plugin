export const Spinner = ({ size = 6 }: { size?: number }) => {
  return (
    <div
      className={`skt-w w-${size} h-${size} rounded-full ${
        size > 8 ? "border-[3px]" : "border-2"
      } border-widget-secondary-text/30 border-t-widget-accent/100 animate-spin`}
    ></div>
  );
};
