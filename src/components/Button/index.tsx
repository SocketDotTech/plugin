interface Props {
  children: React.ReactNode;
}
export const Button = (props: Props) => {
  const { children } = props;
  return <button className="bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600 text-sm">{children}</button>;
};
