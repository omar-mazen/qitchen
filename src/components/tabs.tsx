import clsx from "clsx";

type TabsProps<T extends string> = {
  values: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

export default function Tabs<T extends string>({
  values,
  value,
  onChange,
}: TabsProps<T>) {
  const activeIndex = values.indexOf(value);
  return (
    <div
      style={{
        gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
      }}
      className="relative grid w-auto md:w-fit rounded-2xl border border-border bg-background-muted p-1 overflow-hidden"
    >
      {/* Sliding background */}
      <div
        className={clsx(
          "absolute inset-1 rounded-xl bg-primary transition-transform duration-300 ease-out",
          activeIndex < 0 ? "opacity-0" : "opacity-100"
        )}
        style={{
          width: `calc((100% / ${values.length}) - 2px)`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {values.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={clsx(
            "relative z-10 flex items-center justify-center px-6 py-2 text-sm font-medium text-center text-large",
            item === value
              ? "text-background"
              : "text-primary hover:text-primary-muted"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
