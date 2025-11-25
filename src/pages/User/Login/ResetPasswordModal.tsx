import Button from "@/components/Button";
import Icons from "@/components/Icons";
import Input from "@/components/Input";
import OTPInput from "@/components/OTPInput";
import { regex } from "@/constants/regex";
import { handleInput } from "@/utils";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  resetPassword as resetPasswordAPI,
  sendResetCode as sendResetCodeAPI,
} from "@/services/auth";
import { toast } from "react-toastify";
import DotsLoader from "@/components/DotsLoader";
const MAX_STEPS = 3;
const ResetPasswordModal = (props: {
  email?: string;
  onCloseModal?: () => void;
}) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(props.email || "");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
    confPassword: "",
  });
  useEffect(() => {
    handleInput({
      key: "email",
      regex: regex.email,
      value: email,
      setValue: setEmail,
      setError,
    });
  }, [email]);
  const { mutateAsync: sendResetCode, isPending: otpSending } = useMutation({
    mutationFn: sendResetCodeAPI,
    onSuccess: (data) => {
      toast.success(data.data?.message);
    },
    onError: (error) => {
      toast.error(error.message);
      setStep(1);
    },
  });
  const { mutateAsync: resetPassword, isPending: resetPasswordLoading } =
    useMutation({
      mutationFn: resetPasswordAPI,
      onSuccess: (data) => {
        toast.success(data.data?.message);
        props.onCloseModal?.();
        setEmail("");
        setPassword("");
        setConfPassword("");
        setStep(1);
      },
      onError: (error) => {
        toast.error(error.message);
        setStep(1);
      },
    });

  function goNext() {
    if (step < MAX_STEPS) setStep((step) => step + 1);
  }
  function goPrev() {
    if (step > 1) setStep((step) => step - 1);
  }
  return (
    <div className="relative">
      {/* go back */}
      <span
        onClick={goPrev}
        className={clsx(
          "absolute opacity-0 cursor-pointer z-10 top-2 -left-4 rotate-180 before:absolute before:top-1/2 before:left-1/2 before:bg-background-muted before:w-10 before:h-10 before:rounded-full before:-translate-x-1/2 before:-translate-y-1/2 before:-z-1 transition-all",
          step > 1 && "opacity-100"
        )}
      >
        <Icons.Arrow className=" inline-block h-5 w-5 text-white" />
      </span>
      <div
        className={clsx(
          "flex transition-all ease-in-out duration-1000 w-[420px]"
        )}
        style={{
          transform: `translateX(-${(step - 1) * 100}%)`,
        }}
      >
        {/* step 1*/}
        <div
          className={clsx(
            "shrink-0 w-[420px] px-4 transition-all duration-700 h-auto flex flex-col items-center justify-center",
            step != 1 && "opacity-0"
          )}
        >
          <Icons.LockQuestion className=" w-32 h-32 mx-auto" />
          <p className=" font-normal text-center text-heading-h3 mt-10">
            Reset Your Password
          </p>
          <p className=" font-normal text-center text-large lowercase text-primary-muted mt-2 mb-10">
            Please enter your email address to receive a One-Time Password
            (OTP).
          </p>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            setValue={(value) =>
              handleInput({
                key: "email",
                setError,
                setValue: () => setEmail(value),
                regex: regex.email,
                value: email,
              })
            }
          />
          <Button
            onClick={async () => {
              if (!!error.email || !email) return;
              await sendResetCode({ email: email });
              goNext();
            }}
            disabled={!!error.email || !email || otpSending}
            className="mt-5 w-full"
          >
            {otpSending ? (
              <>
                sending <DotsLoader />
              </>
            ) : (
              "Send OTP to Email"
            )}
          </Button>
          <p className="text-red-400 font-normal text-large my-3 min-h-8">
            {error.email}
          </p>
          <p className=" font-normal text-xlarge mb-2 text-center ">
            <span className="text-primary-muted">Already have an OTP?</span>
            <span
              title={
                error.email
                  ? "type right email"
                  : !email
                    ? "type your mail first"
                    : "enter otp"
              }
              className="cursor-pointer underline ml-2"
              onClick={() => {
                if (!!error.email || !email) return;
                goNext();
              }}
            >
              Click here to enter OTP
            </span>
          </p>
        </div>
        {/* step 2 */}
        <div
          className={clsx(
            "shrink-0 w-[420px] px-4 transition-all duration-700x",
            step != 2 && "opacity-0"
          )}
        >
          <OTPInput
            length={6}
            autoFocus={false}
            onVerify={async (otp) => {
              setOTP(otp);
              goNext();
            }}
          />
        </div>
        {/* step 3 */}
        <div
          className={clsx(
            "shrink-0 w-[420px] px-4 transition-all duration-700 h-auto flex flex-col justify-center",
            step != 3 && "opacity-0"
          )}
        >
          <Icons.LockReset className=" w-32 h-32 mx-auto" />
          <p className=" font-normal text-center text-heading-h3 mt-10">
            Set New Password
          </p>
          <p className=" font-normal text-center text-large lowercase text-primary-muted mt-2 mb-10">
            Must be at least 8 characters, include numbers & symbols.
          </p>
          <Input
            type="password"
            placeholder="password"
            value={password}
            setValue={(value) =>
              handleInput({
                key: "password",
                value,
                setValue: setPassword,
                regex: regex.password,
                setError,
              })
            }
          />
          <Input
            type="password"
            placeholder="confirm password"
            rest={{
              style: { marginTop: "1.75rem", marginBottom: "1.75rem" },
            }}
            value={confPassword}
            setValue={(value) =>
              handleInput({
                key: "confPassword",
                value,
                setValue: setConfPassword,
                regex: regex.password,
                setError,
              })
            }
          />
          <Button
            className="w-full"
            onClick={async () => {
              if (
                !!error.password ||
                !!error.confPassword ||
                !password ||
                !confPassword ||
                !email ||
                !!error.email
              )
                return;
              await resetPassword({ email, newPassword: password, otp });
            }}
            disabled={
              !!error.password ||
              !!error.confPassword ||
              !password ||
              !confPassword ||
              password != confPassword ||
              resetPasswordLoading
            }
          >
            {resetPasswordLoading ? (
              <>
                setting new password <DotsLoader />
              </>
            ) : (
              "set new password"
            )}
          </Button>
          <p className="text-red-400 font-normal text-large mt-3 min-h-8">
            {!!confPassword && confPassword != password
              ? "message the passowrd should match conf password"
              : error.confPassword}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
