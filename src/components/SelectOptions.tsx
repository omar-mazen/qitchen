import { useState, useRef, useLayoutEffect } from "react";
import useClickOutside from "@hooks/useClickOutside";
import Icons from "./Icons";
import clsx from "clsx";

type SelectOptionProps = {
  label: string;
  selectedValue: string | null | Array<unknown>;
  setSelectedValue: (value: string | Array<unknown>) => void;
  options?: string[];
  disable?: boolean;
  full?: boolean;
  search?: boolean;
  multiSelect?: boolean;
};

export default function SelectOption({
  label,
  selectedValue,
  setSelectedValue,
  options = [],
  disable = false,
  full = false,
  multiSelect = false,
  search = true,
}: SelectOptionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom"
  );

  const containerRef = useClickOutside<HTMLDivElement>("click", () =>
    setIsOpen(false)
  );
  const dropdownRef = useRef<HTMLUListElement>(null);

  // Calculate dropdown position when opening
  useLayoutEffect(() => {
    const calculatePosition = () => {
      if (isOpen && containerRef.current && dropdownRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.clientHeight;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - containerRect.bottom;
        const spaceAbove = containerRect.top;

        // If not enough space below but enough space above, position it on top
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setDropdownPosition("top");
        } else {
          setDropdownPosition("bottom");
        }
      }
    };

    // Initial calculation
    calculatePosition();

    // Add scroll event listener
    if (isOpen) {
      window.addEventListener("scroll", calculatePosition, true); // Use capture phase for better performance

      // Cleanup function
      return () => {
        window.removeEventListener("scroll", calculatePosition, true);
      };
    }
  }, [isOpen, containerRef]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative select-none space-y-3 text-large font-medium",
        full ? "w-full" : "w-60 sm:w-72",
        disable && "opacity-50"
      )}
    >
      {/* Toggle Button */}
      <div
        onClick={() => !disable && setIsOpen((s) => !s)}
        className={clsx(
          "flex items-center justify-between bg-primary text-background px-4 py-2 m-0",
          disable ? "cursor-not-allowed" : "cursor-pointer",
          isOpen
            ? dropdownPosition === "bottom"
              ? "rounded-t-lg"
              : "rounded-b-lg"
            : "rounded-lg"
        )}
      >
        <span
          className={clsx(
            "overflow-hidden overflow-ellipsis text-nowrap font-medium capitalize opacity-100"
          )}
        >
          {Array.isArray(selectedValue)
            ? selectedValue.join(", ")
            : selectedValue || label}
        </span>
        <span
          className={clsx(
            "opacity-75  transition ease-in-out duration-200",
            !isOpen && "rotate-180"
          )}
        >
          <Icons.ArrowUp />
        </span>
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <ul
          ref={dropdownRef}
          className={clsx(
            "absolute left-0 z-10 max-h-60 w-full overflow-y-auto bg-background/90 ",
            dropdownPosition === "bottom"
              ? "top-full rounded-b-lg"
              : "bottom-full rounded-t-lg"
          )}
        >
          {/* Search Box */}
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

          {/* Options */}
          {options
            .filter((option) =>
              option?.toLowerCase()?.startsWith(searchString?.toLowerCase())
            )
            .map((option, i) => (
              <li
                key={i}
                className="flex cursor-pointer items-center border-b border-border px-6 py-4 text-left transition-all duration-100 ease-in-out last:border-b-0 hover:backdrop-brightness-75"
                onClick={() => {
                  if (!Array.isArray(selectedValue)) {
                    setSelectedValue(option);
                    setIsOpen(false);
                  }
                }}
              >
                {multiSelect ? (
                  <label className="flex w-full cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(selectedValue) &&
                        selectedValue.includes(option)
                      }
                      className="mr-3 form-checkbox text-amber-500"
                      onChange={() => {
                        if (!Array.isArray(selectedValue)) return;
                        if (selectedValue.includes(option)) {
                          setSelectedValue(
                            selectedValue.filter((opt) => opt !== option)
                          );
                        } else {
                          setSelectedValue([...selectedValue, option]);
                        }
                      }}
                    />
                    {option}
                  </label>
                ) : (
                  <span>{option}</span>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
