import {
  cloneElement,
  createContext,
  useContext,
  useState,
  type ReactNode,
  type ReactElement,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import useKeystroke from "@hooks/useKeyStroke";

// ------------------- Context -------------------
type ModalContextType = {
  openName: string;
  open: (name: string) => void;
  close: () => void;
  bottomSheetScreens: string[];
  modalCloseScreenSize: string[];
};

const ModalContext = createContext<ModalContextType | null>(null);

// ------------------- Modal -------------------
type ModalProps = {
  children: ReactNode;
  bottomSheetScreens?: string[];
  modalCloseScreenSize?: string[];
};

export default function Modal({
  children,
  bottomSheetScreens = ["mobile"],
  modalCloseScreenSize = [],
}: ModalProps) {
  const [openName, setOpenName] = useState<string>("");

  const open = (name: string) => setOpenName(name);
  const close = () => setOpenName("");

  return (
    <ModalContext.Provider
      value={{
        openName,
        open,
        close,
        bottomSheetScreens,
        modalCloseScreenSize,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

// ------------------- Open -------------------
type OpenProps = {
  children: ReactElement<{ onClick?: () => void }>;
  opens: string;
};

function Open({ children, opens }: OpenProps) {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Open must be used within Modal");

  const { open } = ctx;

  return cloneElement(children, {
    onClick: () => open(opens),
  });
}

// ------------------- Window -------------------
type WindowProps = {
  name: string;
  children: ReactElement<{ onCloseModal: () => void }>;
};

function Window({ name, children }: WindowProps) {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Window must be used within Modal");

  const { openName, close } = ctx;

  const ref = useRef(null);
  useKeystroke("Escape", close);

  if (openName !== name) return null;
  return createPortal(
    // modal overlay
    <div
      ref={ref}
      className="fixed left-0 top-0 z-[999] min-h-full min-w-full bg-neutral-800/10 backdrop-blur-[2px] transition-all duration-[0.5s]"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      {/* modal */}
      <div className=" fixed left-1/2 top-1/2 w-full translate-x-[-50%] translate-y-[-50%] overflow-x-hidden overflow-y-auto rounded-lg bg-background px-16 pb-5 sm:max-h-[80%] sm:w-auto sm:min-w-[500px] ">
        <button className="absolute right-4 top-4 p-2" onClick={close}>
          x
        </button>
        <div className="w-full py-4">
          {cloneElement(children, { onCloseModal: close })}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Attach subcomponents
Modal.Window = Window;
Modal.Open = Open;
