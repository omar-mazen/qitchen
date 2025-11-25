import clsx from "clsx";
import React, { useRef } from "react";

const GlassCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const dotRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (dotRef.current) {
      dotRef.current.style.left = `${x}px`;
      dotRef.current.style.top = `${y}px`;
    }
  };
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        if (dotRef.current) dotRef.current.style.display = "block";
      }}
      onMouseLeave={() => {
        if (dotRef.current) dotRef.current.style.display = "none";
      }}
      className={clsx(className, " relative cursor-pointer overflow-hidden")}
    >
      <div>
        <div
          ref={dotRef}
          className="absolute hidden -z-50 w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full pointer-events-none blur-2xl "
        ></div>
      </div>
      {children}
    </div>
  );
};

export default GlassCard;
