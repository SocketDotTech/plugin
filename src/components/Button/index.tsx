interface Props {
  children: React.ReactNode;
}
export const Button = (props: Props) => {
  const { children } = props;
  return <button className="bg-blue-500 text-white rounded px-2 py-1 hover:bg-gray-600 text-sm">{children}</button>;
};
