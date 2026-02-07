import axios, { type AxiosError } from "axios";
import type React from "react";

// ============================================================================
// ERROR HANDLING
// ============================================================================

export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<any>;
    return (
      err.response?.data?.message ||
      err.response?.statusText ||
      `Request failed with status ${err.response?.status}`
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred";
};

// ============================================================================
// FORM INPUT HANDLING
// ============================================================================

export const handleInputError = <T>({
  key,
  value,
  setError,
}: {
  key: string;
  value: string;
  setError: React.Dispatch<React.SetStateAction<T>>;
}) => {
  setError((state: T) => ({ ...state, [key]: value }));
};

export const handleInput = <T>({
  key,
  value,
  setValue,
  regex,
  setError,
}: {
  key: string;
  value: string;
  setValue: (value: string) => void;
  regex: { regex: RegExp; message: string };
  setError: React.Dispatch<React.SetStateAction<T>>;
}) => {
  if (regex.regex.test(value)) {
    setValue(value);
    handleInputError<T>({ key, value: "", setError });
  } else {
    setValue(value);
    handleInputError<T>({ key, value: regex.message, setError });
  }
};

// ============================================================================
// DATE FORMATTING
// ============================================================================

export const toBackendDateFormat = (d: Date) => d.toISOString().split("T")[0]; // e.g. "2025-08-24"

export const toFrontendDateLabel = (d: Date) => {
  const now = new Date();

  // check "today" / "yesterday"
  const diffDays = Math.floor(
    (d.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "today";
  if (diffDays === -1) return "yesterday";

  // fallback: day + weekday
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    weekday: "long",
  });
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

export const formatShortDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase();
};

// ============================================================================
// TIME FORMATTING
// ============================================================================

export const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};

export const toLocalTime = ({ dateString }: { dateString: string }) => {
  const date = new Date(dateString);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

// ============================================================================
// DATE/TIME COMPARISON
// ============================================================================

export const isToday = ({ dateString }: { dateString: string }) => {
  const inputDate = new Date(dateString);
  const today = new Date();

  return (
    inputDate.getUTCFullYear() === today.getUTCFullYear() &&
    inputDate.getUTCMonth() === today.getUTCMonth() &&
    inputDate.getUTCDate() === today.getUTCDate()
  );
};

export const isSameTime = ({
  dateString,
  timeString,
}: {
  dateString: string;
  timeString: string;
}) => {
  const date = new Date(dateString);

  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  const formattedTime = `${hours}:${minutes}`;
  return formattedTime === timeString;
};

export function isCurrentSlot(dateStr: string): boolean {
  const slotStart = new Date(dateStr);
  const slotEnd = new Date(slotStart.getTime() + 24 * 60 * 60 * 1000);
  const now = new Date();

  return now >= slotStart && now <= slotEnd;
}

// ============================================================================
// DOM UTILITIES
// ============================================================================

export function getScrollParentAfterRoot(
  el: HTMLElement | null
): HTMLElement | Window {
  if (!el) return window;

  let parent: HTMLElement | null = el.parentElement;

  while (parent && parent !== document.body) {
    // Stop at root element
    if (parent.id === "root") break;

    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;

    // Check for any scrollable overflow
    const hasScrollableOverflow =
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowX === "auto" ||
      overflowX === "scroll";

    // Also check if element actually has scrollable content
    const hasScrollableContent =
      parent.scrollHeight > parent.clientHeight ||
      parent.scrollWidth > parent.clientWidth;

    if (hasScrollableOverflow && hasScrollableContent) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return window;
}

export function getRelativeOffset(
  el: HTMLElement,
  parent: HTMLElement | Window
) {
  const elRect = el.getBoundingClientRect();

  if (parent instanceof Window) {
    return {
      top: elRect.top + window.scrollY,
      left: elRect.left + window.scrollX,
    };
  }

  const parentRect = parent.getBoundingClientRect();
  return {
    top: elRect.top - parentRect.top + (parent as HTMLElement).scrollTop,
    left: elRect.left - parentRect.left + (parent as HTMLElement).scrollLeft,
  };
}
