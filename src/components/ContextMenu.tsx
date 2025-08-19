import { useContext, useState, type ReactNode, type MouseEvent } from "react";
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
  onClick?: () => void;
  to?: string | null;
}

const ContextMenuContext = createContext<MenuContextProps | undefined>(
  undefined,
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
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
}

function Toggle({ children, name }: ToggleProps) {
  const { close, open, setPosition, openName } = useContextMenu();

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: window.innerWidth - (rect.right + rect.left) / 2,
      y: rect.height + rect.y + 8,
    });
    name === openName ? close() : open(name);
  }

  return <button onClick={handleClick}>{children}</button>;
}

function List({ children, name }: ListProps) {
  const { close, position, openName, alignment, size, fixedPosition } =
    useContextMenu();
  const ref = useClickOutside<HTMLUListElement>("click", close, false);

  if (name !== openName) return null;

  return createPortal(
    <ul
      onScroll={(e) => e.stopPropagation()}
      ref={ref}
      style={{
        top: `${position.y}px`,
        right: `${position.x}px`,
      }}
      className={`${fixedPosition ? "fixed" : "absolute"} z-10 bg-background  ${
        size === "sm" ? "w-64" : size === "md" ? "w-96" : "w-[250px]"
      } ${
        alignment === "right"
          ? "translate-x-[100%]"
          : alignment === "center"
            ? "translate-x-[50%]"
            : ""
      } max-h-[300px] divide-y divide-primary/20 overflow-y-auto rounded-2xl drop-shadow-lg drop-shadow-primary/10`}
    >
      {children}
    </ul>,
    document.body,
  );
}

function Item({ children, icon, onClick, to = null }: ItemProps) {
  const { close } = useContextMenu();

  const handleClick = () => {
    onClick?.();
    close();
  };

  if (to)
    return (
      <li onClick={handleClick}>
        <Link
          to={to}
          className={`grid cursor-pointer text-xl hover:backdrop-brightness-200 ${
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
