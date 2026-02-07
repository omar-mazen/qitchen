import {
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import Icons from "./Icons";
import { useAuth } from "@/hooks/useAuth";
import Button from "./Button";
import { formatDuration } from "@/utils";

interface OTPInputProps {
  /**
   * Total number of OTP input digits.
   * @default 6
   */
  length?: number;

  /**
   * Callback triggered when all OTP input fields are filled.
   * Provides the complete OTP as a string.
   */
  onComplete?: (otp: string) => void;

  /**
   * Whether the first OTP input should automatically receive focus on mount.
   * @default true
   */
  autoFocus?: boolean;

  /**
   * Email address to which the OTP has been sent.
   * Used for display or contextual information.
   */
  email?: string;

  /**
   * Time in minutes before the user is allowed to request a new OTP.
   */
  availableAfter?: number;

  /**
   * Asynchronous callback invoked when the user submits the OTP for verification.
   * Receives the complete OTP as a string.
   */
  onVerify?: (otp: string) => Promise<unknown>;

  /**
   * Asynchronous callback invoked when the user requests to resend the OTP.
   */
  onResend?: () => Promise<unknown>;

  /**
   * Indicates whether the OTP input or actions are in a loading state.
   * Can be used to disable inputs and show a spinner during async operations.
   */
  isLoading?: boolean;
}

const OTPInput = ({
  length = 6,
  onComplete,
  autoFocus = true,
  email,
  availableAfter = 0,
  onVerify,
  onResend,
  isLoading,
}: OTPInputProps) => {
  const [values, setValues] = useState<string[]>(
    Array.from({ length }, () => "")
  );
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [remaining, setRemaining] = useState(availableAfter * 60); // in seconds (15 mins)

  useEffect(() => {
    if (remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining]);

  const { user } = useAuth();
  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  // helper to join digits
  const otpString = (vals: string[]) => vals.join("");

  useEffect(() => {
    const joined = otpString(values);
    if (joined.length === length && !values.includes("")) {
      onComplete?.(joined);
    }
  }, [values, length, onComplete]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const raw = e.target.value;
    // keep only digits and max 1 char per input
    const char = raw.replace(/\D/g, "").slice(0, 1);
    if (!char) return;
    const next = [...values];
    next[idx] = char;
    setValues(next);

    // move focus to next input if exists
    if (idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
      inputsRef.current[idx + 1]?.select?.();
    } else {
      inputsRef.current[idx]?.blur?.();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    const key = e.key;

    if (key === "Backspace") {
      e.preventDefault();
      const next = [...values];
      if (next[idx]) {
        // clear current value
        next[idx] = "";
        setValues(next);
      } else if (idx > 0) {
        // move back and clear previous
        inputsRef.current[idx - 1]?.focus();
        const prev = [...values];
        prev[idx - 1] = "";
        setValues(prev);
      }
    } else if (key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      inputsRef.current[idx - 1]?.focus();
    } else if (key === "ArrowRight" && idx < length - 1) {
      e.preventDefault();
      inputsRef.current[idx + 1]?.focus();
    } else if (key === "Enter") {
      e.preventDefault();
      if (values[idx]) {
        if (idx < length - 1) {
          // go to next input
          inputsRef.current[idx + 1]?.focus();
        } else {
          // if last input, go to Verify button
          document.getElementById("otp-verify-btn")?.focus();
        }
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const digits = paste.replace(/\D/g, "").slice(0, length).split("");
    if (digits.length === 0) return;

    const next = [...values];
    for (let i = 0; i < length; i++) {
      next[i] = digits[i] ?? "";
    }
    setValues(next);

    // focus next empty input or blur if full
    const firstEmpty = next.findIndex((c) => c === "");
    if (firstEmpty !== -1) {
      inputsRef.current[firstEmpty]?.focus();
    } else {
      inputsRef.current[length - 1]?.blur();
    }
  };
  return (
    <div className="text-center font-normal capitalize p-4">
      <Icons.EmailRead className=" text-green-400 h-32 w-32 mx-auto" />
      <div className="mt-10">
        <p className=" text-heading-h3">please check your email</p>
        <p className=" text-large lowercase text-primary-muted mt-2">
          We’ve sent a {length}-digit verification code to your email address:{" "}
          <strong>{user?.email ?? email ?? "your email address"}</strong>
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const joined = otpString(values);
          if (joined.length === length && !joined.includes("")) {
            onComplete?.(joined);
          }
        }}
        className="flex flex-col items-center gap-4"
      >
        <div
          className="flex gap-2 my-10"
          onPaste={handlePaste}
          role="group"
          aria-label={`${length}-digit verification code`}
        >
          {values.map((val, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              value={val}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              aria-label={`Digit ${idx + 1}`}
              style={{
                marginInlineStart:
                  length % 2 === 0 && length / 2 == idx ? "6px" : "",
              }}
              className="w-14 h-16 text-center text-xlarge rounded-xl border focus:outline-none focus:ring outline-none"
            />
          ))}
        </div>
        {remaining > 0 ? (
          <p className="mb-5">
            Send again after{" "}
            <strong className="w-20 text-left inline-block">
              {formatDuration(remaining)}
            </strong>
          </p>
        ) : (
          onResend && (
            <p className="text-large mb-5" onClick={onResend}>
              <span className="text-primary-muted">{`didn't get the code?`}</span>
              <strong className="underline cursor-pointer ml-2">
                click to resend
              </strong>
            </p>
          )
        )}
        <Button
          id="otp-verify-btn"
          type="primary"
          disabled={values.some((v) => v === "") || isLoading}
          className="px-4 py-2 w-full"
          onClick={() => onVerify?.(otpString(values))}
        >
          Verify
        </Button>
      </form>
    </div>
  );
};

export default OTPInput;
