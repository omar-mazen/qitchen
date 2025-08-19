import { useEffect, useRef, RefObject } from "react";

export default function useClickOutside<T extends HTMLElement>(
  event: keyof DocumentEventMap = "click",
  handler?: () => void,
  listenCapturing: boolean = true,
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClick(e: Event) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler?.();
      }
    }

    document.addEventListener(event, handleClick, listenCapturing);
    return () => {
      document.removeEventListener(event, handleClick, listenCapturing);
    };
  }, [event, handler, listenCapturing]);

  return ref;
}
