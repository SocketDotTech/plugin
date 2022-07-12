export const Spinner = ({ size = 6 }: { size?: number }) => {
  return (
    <div
      className={`w-${size} h-${size} rounded-full ${
        size > 8 ? "border-[3px]" : "border-2"
      } border-opacity-50 border-t-widget-accent animate-spin`}
    ></div>
  );
};
