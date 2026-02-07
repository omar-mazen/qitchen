import Button from "@/components/Button";
import Icons from "@/components/Icons";
import Input from "@/components/Input";
import OTPInput from "@/components/OTPInput";
import clsx from "clsx";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import {
  resetPassword as resetPasswordAPI,
  sendResetCode as sendResetCodeAPI,
} from "@/services/auth";
import { toast } from "react-toastify";
import DotsLoader from "@/components/DotsLoader";
import * as yup from "yup";
import { regex } from "@/constants/regex";

const resetPasswordSchema = yup.object({
  email: yup
    .string()
    .matches(regex.email.regex, regex.email.message)
    .required("Email is required"),

  password: yup
    .string()
    .matches(regex.password.regex, regex.password.message)
    .required("Password is required"),

  confPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const MAX_STEPS = 3;

type FormData = {
  email: string;
  password: string;
  confPassword: string;
};

const ResetPasswordModal = ({
  email: initialEmail = "",
  onCloseModal,
}: {
  email?: string;
  onCloseModal?: () => void;
}) => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields },
  } = useForm<FormData>({
    resolver: yupResolver(resetPasswordSchema),
    mode: "all",
    defaultValues: { email: initialEmail },
  });

  const email = watch("email");

  const { mutateAsync: sendResetCode, isPending: otpSending } = useMutation({
    mutationFn: sendResetCodeAPI,
    onSuccess: (data) => toast.success(data.data?.message),
  });

  const { mutateAsync: resetPassword, isPending: resetLoading } = useMutation({
    mutationFn: resetPasswordAPI,
    onSuccess: (data) => {
      toast.success(data.data?.message);
      onCloseModal?.();
      setStep(1);
    },
  });

  const goNext = () => step < MAX_STEPS && setStep(step + 1);
  const goPrev = () => step > 1 && setStep(step - 1);

  return (
    <div className="relative">
      {/* Back Arrow */}
      <span
        onClick={goPrev}
        className={clsx(
          "absolute opacity-0 cursor-pointer z-10 top-2 -left-4 rotate-180 transition-all",
          step > 1 && "opacity-100"
        )}
      >
        <Icons.Arrow className="h-5 w-5 text-white" />
      </span>

      <div
        className="flex transition-all duration-700 w-[420px]"
        style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
      >
        {/* STEP 1 — EMAIL */}
        <div
          className={clsx("shrink-0 w-[420px] px-4", step !== 1 && "opacity-0")}
        >
          <Icons.LockQuestion className="w-32 h-32 mx-auto" />
          <p className="text-heading-h3 text-center mt-10">
            Reset Your Password
          </p>

          <Input
            type="email"
            placeholder="Enter your email"
            register={register("email")}
          />

          {/* Animated error */}
          <p
            className={clsx(
              "text-red-500 text-medium transition-all duration-500 mt-3",
              errors.email
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            )}
          >
            {errors.email?.message}
          </p>

          <Button
            className="w-full mt-4"
            disabled={!email || !!errors.email || otpSending}
            onClick={async () => {
              await sendResetCode({ email });
              goNext();
            }}
          >
            {otpSending ? (
              <>
                sending <DotsLoader />
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
        </div>

        {/* STEP 2 — OTP */}
        <div
          className={clsx("shrink-0 w-[420px] px-4", step !== 2 && "opacity-0")}
        >
          <OTPInput
            autoFocus={false}
            length={6}
            onVerify={(value) => {
              setOtp(value);
              goNext();
            }}
          />
        </div>

        {/* STEP 3 — PASSWORD */}
        <div
          className={clsx("shrink-0 w-[420px] px-4", step !== 3 && "opacity-0")}
        >
          <Icons.LockReset className="w-32 h-32 mx-auto" />

          <Input
            type="password"
            placeholder="password"
            register={register("password")}
          />
          <p
            className={clsx(
              "text-red-500 text-medium transition-all duration-500 mt-3",
              errors.password
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            )}
          >
            {errors.password?.message}
          </p>

          <Input
            type="password"
            placeholder="confirm password"
            register={register("confPassword")}
          />
          <p
            className={clsx(
              "text-red-500 text-medium transition-all duration-500 mt-3",
              errors.confPassword
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            )}
          >
            {errors.confPassword?.message}
          </p>

          <Button
            className="w-full mt-4"
            disabled={!isValid || resetLoading}
            onClick={handleSubmit(async (data) => {
              await resetPassword({
                email: data.email,
                newPassword: data.password,
                otp,
              });
            })}
          >
            {resetLoading ? (
              <>
                setting password <DotsLoader />
              </>
            ) : (
              "Set new password"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
