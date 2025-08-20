import { useEffect } from "react";

export default function useKeystroke(
  key: string,
  handler: () => void,
  targetElement: Document | HTMLElement = document
) {
  useEffect(() => {
    function handleKeydown(e: Event) {
      const keyboardEvent = e as KeyboardEvent;
      if (keyboardEvent.key === key) {
        handler();
      }
    }
    targetElement.addEventListener("keydown", handleKeydown);
    return () => {
      targetElement.removeEventListener("keydown", handleKeydown);
    };
  }, [handler, key, targetElement]);
}
