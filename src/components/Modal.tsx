import {
  cloneElement,
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type ReactElement,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import useKeystroke from "@hooks/useKeyStroke";
import Icons from "./Icons";

// ------------------- Context -------------------
type ModalContextType = {
  openName: string;
  open: (name: string) => void;
  close: () => void;
  bottomSheetScreens: string[];
  modalCloseScreenSize: string[];
};

const ModalContext = createContext<ModalContextType | null>(null);

// ------------------- Custom Hook -------------------
export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within Modal");
  return ctx;
}

// ------------------- Modal -------------------
type ModalProps = {
  children: ReactNode;
  bottomSheetScreens?: string[];
  modalCloseScreenSize?: string[];
  initialOpen?: string; // New prop for initially open modal
  onClose?: () => void;
};

export default function Modal({
  children,
  bottomSheetScreens = ["mobile"],
  modalCloseScreenSize = [],
  initialOpen = "", // New prop with default empty string
  onClose,
}: ModalProps) {
  const [openName, setOpenName] = useState<string>(initialOpen);

  const open = (name: string) => setOpenName(name);
  const close = () => {
    setOpenName("");
    onClose?.();
  };

  // Handle initialOpen changes
  useEffect(() => {
    if (initialOpen) {
      setOpenName(initialOpen);
    }
  }, [initialOpen]);

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
  const { open } = useModal(); // Using the hook

  return cloneElement(children, {
    onClick: () => open(opens),
  });
}

// ------------------- Window -------------------
type WindowProps = {
  name: string;
  children: ReactElement<{ onCloseModal: () => void }>;
  initialOpen?: boolean; // New prop for initially opening the modal
};

function Window({ name, children, initialOpen = false }: WindowProps) {
  const { openName, open, close } = useModal(); // Using the hook
  const ref = useRef<HTMLDivElement>(null);
  const hasInitiallyOpened = useRef(false); // Track if initially opened

  useKeystroke("Escape", close);

  // Handle initialOpen - only run once
  useEffect(() => {
    if (initialOpen && !hasInitiallyOpened.current) {
      open(name);
      hasInitiallyOpened.current = true;
    }
  }, [initialOpen, name, open]);

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
      <div className="fixed left-1/2 top-1/2 w-full translate-x-[-50%] translate-y-[-50%] overflow-x-hidden overflow-y-auto rounded-lg bg-background px-16 pb-5 sm:max-h-[80%] sm:w-auto sm:min-w-[500px]">
        <button className="absolute right-4 top-4 p-2 z-10" onClick={close}>
          <Icons.XMark />
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
