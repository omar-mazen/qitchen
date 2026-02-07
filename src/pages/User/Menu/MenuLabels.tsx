import Label from "@components/Label";

const MenuLabels = ({ labels }: { labels: string[] }) => {
  return (
    <div className="text-center space-x-5 overflow-x-auto sticky top-0 py-5 z-[2]">
      {labels.map((label) => (
        <Label
          key={label}
          children={label}
          isActive={false}
          onClick={() => {
            const el = document.getElementById(label);
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      ))}
    </div>
  );
};
export default MenuLabels;
