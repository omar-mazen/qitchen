import { memo, useRef, useState, useEffect } from "react";
import clsx from "clsx";
import Badge from "./Badge";

interface QuantitySelectorBase {
  centered?: boolean;
  quantity: number;
  isAvailable: boolean;
}

// No accelerate
interface QuantitySelectorNoAccelerate extends QuantitySelectorBase {
  isAccelerates: false;
  onChange: (nextQty: number) => void; // send immediately
}

// With accelerate
interface QuantitySelectorWithAccelerate extends QuantitySelectorBase {
  isAccelerates: true;
  onCommit: (nextQty: number) => void; // send on release
  onChangeLocal?: (nextQty: number) => void; // optional local update
}

// Union type for props
type QuantitySelectorProps =
  | QuantitySelectorNoAccelerate
  | QuantitySelectorWithAccelerate;

const QuantitySelector = memo((props: QuantitySelectorProps) => {
  const { centered = true, quantity, isAvailable } = props;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [localQty, setLocalQty] = useState(quantity);

  useEffect(() => {
    setLocalQty(quantity);
  }, [quantity]);

  // --- interval logic ---
  const startInterval = (delta: number) => {
    setLocalQty((prev) => {
      const next = prev + delta;
      if (props.isAccelerates) props.onChangeLocal?.(next);
      return next;
    });

    intervalRef.current = setInterval(() => {
      setLocalQty((prev) => {
        const next = prev + delta;
        if (props.isAccelerates) props.onChangeLocal?.(next);
        return next;
      });
    }, 200);
  };

  const clearIntervalRef = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;

      // commit once on release
      if (props.isAccelerates) {
        props?.onCommit(localQty);
      }
    }
  };

  // --- helpers for simple mode ---
  const handleClick = (delta: number) => {
    if (!props.isAccelerates) {
      const next = quantity + delta;
      props.onChange(next);
    }
  };

  return (
    <span
      className={clsx("flex items-center gap-2", centered && "justify-center")}
    >
      <Badge
        disabled={!isAvailable || localQty <= 1}
        onPressStart={() =>
          props.isAccelerates ? startInterval(-1) : undefined
        }
        onPressEnd={() =>
          props.isAccelerates ? clearIntervalRef() : undefined
        }
        onClick={() => handleClick(-1)}
      >
        -
      </Badge>

      <span>{localQty}</span>

      <Badge
        disabled={!isAvailable}
        onPressStart={() =>
          props.isAccelerates ? startInterval(1) : undefined
        }
        onPressEnd={() =>
          props.isAccelerates ? clearIntervalRef() : undefined
        }
        onClick={() => handleClick(1)}
      >
        +
      </Badge>
    </span>
  );
});

export default QuantitySelector;
