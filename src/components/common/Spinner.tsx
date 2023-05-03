export const Spinner = ({ size = 6 }: { size?: number }) => {
  return (
    <div
      className={`skt-w skt-w-w-${size} skt-w-h-${size} skt-w-rounded-full ${
        size > 8 ? "skt-w-border-[3px]" : "skt-w-border-2"
      } skt-w-border-widget-secondary-text/30 skt-w-border-t-widget-accent/100 skt-w-animate-spin`}
    ></div>
  );
};
