import { useState } from "react";
import useClickOutside from "@hooks/useClickOutside";
import Icons from "./Icons";
import clsx from "clsx";

type SelectOptionProps = {
  label: string;
  selectedValue: string | null;
  setSelectedValue: (value: string) => void;
  options?: string[];
  disable?: boolean;
  full?: boolean;
  search?: boolean;
};

export default function SelectOption({
  label,
  selectedValue,
  setSelectedValue,
  options = [],
  disable = false,
  full = false,
  search = true,
}: SelectOptionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const ref = useClickOutside<HTMLDivElement>("click", () => setIsOpen(false));

  return (
    <div
      ref={ref}
      className={clsx(
        "relative h-[4rem] select-none space-y-3 text-large font-normal font-medium",
        full ? "w-full" : "w-60 sm:w-72",
        disable && "opacity-50"
      )}
    >
      <div
        onClick={() => !disable && setIsOpen((s) => !s)}
        className={clsx(
          "flex h-full items-center justify-between bg-neutral-800 px-6 py-3",
          disable ? "cursor-not-allowed" : "cursor-pointer",
          isOpen ? "rounded-t-lg" : "rounded-lg"
        )}
      >
        <span
          className={clsx(
            "overflow-hidden overflow-ellipsis text-nowrap",
            selectedValue
              ? "font-medium capitalize opacity-100"
              : "text-small opacity-75"
          )}
        >
          {selectedValue || label}
        </span>

        <span className={clsx("opacity-75", !isOpen && "rotate-180")}>
          <Icons.ArrowUp />
        </span>
      </div>

      {isOpen && (
        <ul className="absolute left-0 z-10 max-h-60 w-full overflow-y-auto rounded-b-lg bg-neutral-800 drop-shadow-2xl drop-shadow-background">
          {search && (
            <div className="relative">
              <input
                type="text"
                className="w-full border-b border-border bg-secondary-neutral-800 py-2 pl-11 pr-2 outline-none focus:ring-[1px] focus:ring-border"
                placeholder={`Search about ${label}`}
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              />
              <span className="absolute left-6 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Icons.Search />
              </span>
            </div>
          )}

          {options
            .filter((option) =>
              option.toLowerCase().startsWith(searchString.toLowerCase())
            )
            .map((option, i) => (
              <li
                key={i}
                className=" text-left cursor-pointer border-b border-border px-6 py-4 transition-all duration-100 ease-in-out last:border-b-0 hover:backdrop-brightness-75"
                onClick={() => {
                  setSelectedValue(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
