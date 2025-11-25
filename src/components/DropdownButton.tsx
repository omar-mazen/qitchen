import Icons from "./Icons";
import { useRef, useState, useLayoutEffect } from "react";
import clsx from "clsx";
import Button from "./Button";
import useClickOutside from "@/hooks/useClickOutside";

interface IProps {
  disabled?: boolean;
  buttonText: string | React.ReactNode;
  items: string[];
  onSelected: (item: string) => void;
  onSubmit: () => void;
}
const DropdownButton = ({
  disabled = false,
  buttonText,
  items,
  onSelected,
  onSubmit,
}: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useClickOutside<HTMLDivElement>("click", () =>
    setIsOpen(false)
  );
  const listRef = useRef<null | HTMLUListElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  useLayoutEffect(() => {
    const calculatePosition = () => {
      if (isOpen && containerRef.current && listRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const dropdownHeight = listRef.current.clientHeight;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - containerRect.bottom;
        const spaceAbove = containerRect.top;

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setDropdownPosition("top");
        } else {
          setDropdownPosition("bottom");
        }
      }
    };

    calculatePosition();

    // Add scroll event listener
    if (isOpen) {
      window.addEventListener("scroll", calculatePosition, true);

      return () => {
        window.removeEventListener("scroll", calculatePosition, true);
      };
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="grow relative z-[9999]">
      <Button
        className={clsx(
          "flex items-center w-full justify-center !p-1 font-meta border border-border transition-colors bg-primary text-background hover:!bg-primary hover:!text-background",
          isOpen
            ? dropdownPosition === "bottom"
              ? " rounded-none !rounded-t-lg"
              : " rounded-none !rounded-b-lg"
            : "!rounded-lg"
        )}
        disabled={disabled}
      >
        <span
          onClick={onSubmit}
          className="grow hover:backdrop-brightness-90 inline-block rounded-lg py-1.5 px-2 transition-all duration-200"
        >
          {buttonText}
        </span>
        <span className="px-1">|</span>
        <span
          className={clsx(
            "ml-2 ease-in-out duration-200 hover:backdrop-brightness-90 inline-block rounded-lg py-1.5 px-2 transition-all"
          )}
          onClick={() => {
            setIsOpen((s) => !s);
          }}
        >
          <Icons.ArrowUp
            className={clsx(
              "transition-transform duration-300",
              !isOpen && "rotate-180"
            )}
          />
        </span>
      </Button>
      {isOpen && (
        <ul
          ref={listRef}
          className={clsx(
            "absolute left-0 w-full max-h-72 overflow-y-auto  text-primary border border-border z-10 bg-background/90 a",
            dropdownPosition === "bottom"
              ? "top-full rounded-none rounded-b-lg"
              : "bottom-full rounded-none rounded-t-lg"
          )}
        >
          {items?.map((item, i) => (
            <li
              key={item + i}
              className="px-4 py-2 hover:bg-primary hover:text-background cursor-pointer transition-colors"
              onClick={() => onSelected(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownButton;
