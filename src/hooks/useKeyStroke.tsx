import { useEffect } from "react";

export default function useKeystroke(
  key: string,
  handler: () => void,
  targetElement: Document | HTMLElement = document
) {
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === key) {
        handler();
      }
    }

    targetElement.addEventListener("keydown", handleKeydown);
    return () => {
      targetElement.removeEventListener("keydown", handleKeydown);
    };
  }, [handler, key, targetElement]);
}
