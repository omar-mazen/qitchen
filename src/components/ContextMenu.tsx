import {
  useContext,
  useState,
  type ReactNode,
  type MouseEvent,
  useRef,
} from "react";
import { createContext } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";

import useClickOutside from "@hooks/useClickOutside";

// Types
type Alignment = "right" | "center" | "left";
type Size = "sm" | "md" | "custom";

interface MenuContextProps {
  open: (name: string) => void;
  close: () => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  openName: string | false;
  alignment: Alignment;
  size: Size;
  fixedPosition: boolean;
  positionRef: React.RefObject<null | HTMLElement>;
}

interface MenuProps {
  children: ReactNode;
  alignment?: Alignment;
  size?: Size;
  fixedPosition?: boolean;
}

interface ToggleProps {
  children: ReactNode;
  name: string;
}

interface ListProps {
  children: ReactNode;
  name: string;
}

interface ItemProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  to?: string | null;
  autoClose?: boolean;
}

const ContextMenuContext = createContext<MenuContextProps | undefined>(
  undefined
);

export default function ContextMenu({
  children,
  alignment = "right",
  size = "sm",
  fixedPosition = false,
}: MenuProps) {
  const [openName, setOpenName] = useState<string | false>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const positionRef = useRef(null);
  const open = (name: string) => setOpenName(name);
  const close = () => setOpenName("");

  return (
    <ContextMenuContext.Provider
      value={{
        open,
        close,
        position,
        setPosition,
        openName,
        alignment,
        size,
        fixedPosition,
        positionRef,
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
}

function Toggle({ children, name }: ToggleProps) {
  const { close, open, setPosition, openName, positionRef } = useContextMenu();

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: window.innerWidth - (rect.right + rect.left) / 2,
      y: rect.height + rect.y + 8,
    });
    name === openName ? close() : open(name);
  }

  return (
    <button ref={positionRef} onClick={handleClick}>
      {children}
    </button>
  );
}

function List({ children, name }: ListProps) {
  const {
    close,
    position,
    openName,
    alignment,
    size,
    fixedPosition,
    positionRef,
  } = useContextMenu();
  const ref = useClickOutside<HTMLDivElement>("click", close, false);

  if (name !== openName) return null;

  return createPortal(
    <div
      ref={ref}
      style={{
        top: `${position.y}px`,
        right: `${position.x}px`,
      }}
      className={`${fixedPosition ? "fixed" : "absolute"} absolute z-10  ${
        size === "sm" ? "w-64" : size === "md" ? "w-96" : "w-[250px]"
      } ${
        alignment === "right"
          ? "translate-x-[100%]"
          : alignment === "center"
            ? "translate-x-[50%]"
            : ""
      } max-h-[300px] rounded-2xl backdrop-blur-sm bg-background/90 `}
    >
      <ul className="overflow-y-auto divide-y divide-border">{children}</ul>
    </div>,
    positionRef.current
  );
}

function Item({
  children,
  icon,
  onClick,
  to = null,
  autoClose = true,
}: ItemProps) {
  const { close } = useContextMenu();

  const handleClick = () => {
    onClick?.();
    if (autoClose) close();
  };

  if (to)
    return (
      <li onClick={handleClick} className="w-full">
        <Link
          to={to}
          className={` w-full grid cursor-pointer text-xl hover:backdrop-brightness-200 ${
            icon ? "grid-cols-[30px_1fr]" : "grid-cols-1"
          } line-clamp-2 items-center gap-3 text-small hover:backdrop-brightness-90`}
        >
          {icon && (
            <span className="m-auto self-center justify-self-start">
              {icon}
            </span>
          )}
          <p
            className={`h-full w-full max-w-full ${icon ? "" : "px-6"} py-6 transition-all duration-100 ease-in-out`}
          >
            {children}
          </p>
        </Link>
      </li>
    );

  return (
    <li
      onClick={handleClick}
      className={`grid cursor-pointer ${icon ? "grid-cols-[50px_1fr]" : "grid-cols-1"} line-clamp-2 items-center gap-3 text-xl hover:backdrop-brightness-200`}
    >
      {icon && (
        <span className="m-auto self-center justify-self-start">{icon}</span>
      )}
      <p
        className={`h-full w-full max-w-full ${icon ? "" : "px-6"} py-6 transition-all duration-100 ease-in-out`}
      >
        {children}
      </p>
    </li>
  );
}

ContextMenu.Toggle = Toggle;
ContextMenu.List = List;
ContextMenu.Item = Item;

export function useContextMenu(): MenuContextProps {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within a Menu provider");
  }
  return context;
}
