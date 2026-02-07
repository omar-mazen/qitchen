import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import clsx from "clsx";
import Icons from "./Icons";

interface PaginationProps {
  total: number;
}

export default function Pagination({ total }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const containerRef = useRef<HTMLUListElement | null>(null);
  const pageRef = useRef<HTMLButtonElement | null>(null);

  const [available, setAvailable] = useState<number>(1);

  const currPage = Number(searchParams.get("page")) || 1;

  /** =========================
   * Resize Logic
   ========================== */
  useEffect(() => {
    if (!containerRef.current || !pageRef.current) return;

    const calculate = () => {
      const containerWidth = containerRef.current!.clientWidth;
      const pageWidth = pageRef.current!.clientWidth;

      if (!pageWidth) return;

      setAvailable(Math.max(1, Math.floor(containerWidth / pageWidth)));
    };

    calculate();

    const observer = new ResizeObserver(calculate);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const setPage = (page: number) => {
    if (page < 1 || page > total) return;

    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(page));
    setSearchParams(newParams);
  };

  return (
    <div className="flex items-center rounded-2xl drop-shadow-md">
      {/* Prev */}
      <button
        ref={pageRef}
        onClick={() => setPage(currPage - 1)}
        className={clsx(
          "flex min-h-20 min-w-20 items-center justify-center rounded-l-2xl bg-background-muted",
          currPage === 1 ? "cursor-not-allowed text-primary" : "cursor-pointer"
        )}
      >
        <Icons.ArrowUp className="-rotate-90" />
      </button>

      {/* Pages */}
      <ul
        ref={containerRef}
        className="flex h-fit w-full items-center bg-background-muted text-medium"
      >
        {Array.from({ length: available }, (_, i) => {
          const chunk = Math.floor((currPage - 1) / available);
          const page = chunk * available + i + 1;

          if (page > total) return null;

          return (
            <li
              key={page}
              onClick={() => setPage(page)}
              className={clsx(
                "flex min-h-20 min-w-20 cursor-pointer items-center justify-center rounded-2xl",
                currPage === page && [
                  "relative z-[2] text-background",
                  "before:absolute before:left-1/2 before:top-1/2 before:z-[-1]",
                  "before:h-12 before:w-12 before:-translate-x-1/2 before:-translate-y-1/2",
                  "before:rounded-full before:bg-primary",
                ]
              )}
            >
              {page}
            </li>
          );
        })}
      </ul>

      {/* Next */}
      <button
        onClick={() => setPage(currPage + 1)}
        className={clsx(
          "flex h-20 w-20 items-center justify-center rounded-r-2xl bg-background-muted",
          currPage === total
            ? "cursor-not-allowed text-primary"
            : "cursor-pointer"
        )}
      >
        <Icons.ArrowUp className="rotate-90" />
      </button>
    </div>
  );
}
