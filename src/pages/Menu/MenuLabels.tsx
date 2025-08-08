import Label from "@components/Label";

const MenuLabels = ({ labels }: { labels: string[] }) => {
  return (
    <div className="text-center space-x-5 mt-10">
      {labels.map((label) => (
        <Label key={label} children={label} isActive={false} />
      ))}
    </div>
  );
};
export default MenuLabels;
