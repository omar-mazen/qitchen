import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  sendVerfictionCode as sendVerfictionCodeApi,
  verfiyEmail as verfiyEmailApi,
} from "@/services/auth";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import OTPInput from "../OTPInput";
import { toast } from "react-toastify";
import clsx from "clsx";
import Button from "../Button";
import Icons from "../Icons";

const MAX_STEPS = 2;
const VerifyModal = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  useEffect(() => {
    const closed = sessionStorage.getItem("bannerClosed");
    if (!closed) {
      setShowBanner(true);
    }
  }, []);
  const handleClose = () => {
    setShowBanner(false);
    sessionStorage.setItem("bannerClosed", "true");
  };
  const queryClient = useQueryClient();
  const { mutateAsync: verfiyEmail, isPending: isVerfiying } = useMutation({
    mutationFn: verfiyEmailApi,
    mutationKey: ["user"],
    onSuccess: () =>
      queryClient.refetchQueries({ queryKey: ["user"], exact: false }),
  });
  const { mutateAsync: sendVerfictionCode, isPending: isSending } = useMutation(
    {
      mutationFn: sendVerfictionCodeApi,
      mutationKey: ["user"],
      onSuccess: () =>
        queryClient.refetchQueries({ queryKey: ["user"], exact: false }),
    }
  );
  function goNext() {
    if (step < MAX_STEPS) setStep((step) => step + 1);
  }
  return (
    <>
      {user?._id && !user?.isAccountVerified && showBanner && (
        <Modal onClose={handleClose}>
          <Modal.Window name="verify" initialOpen={true}>
            <div
              className={clsx(
                "flex transition-all ease-in-out duration-1000 w-[420px]"
              )}
              style={{
                transform: `translateX(-${(step - 1) * 100}%)`,
              }}
            >
              {/* step 1 */}
              <div
                className={clsx(
                  "shrink-0 w-[420px] px-4 transition-all duration-700 h-auto flex flex-col items-center justify-center",
                  step != 1 && "opacity-0"
                )}
              >
                <Icons.UserShield className=" mx-auto w-42 h-42 mb-10" />
                <p className=" text-center font-normal">
                  Your account isn’t verified yet. To keep your account secure
                  and access all features, please verify it.
                </p>
                <Button
                  className="font-semibold my-10 font-normala"
                  onClick={goNext}
                >
                  Verify Now
                </Button>
              </div>
              {/* step 2 */}
              <div
                className={clsx(
                  "shrink-0 w-[420px] px-4 transition-all duration-700 h-auto flex flex-col items-center justify-center",
                  step != 2 && "opacity-0"
                )}
              >
                <OTPInput
                  isLoading={isSending || isVerfiying}
                  length={6}
                  autoFocus={false}
                  onVerify={async (otp) =>
                    await toast.promise(
                      () => verfiyEmail({ otp, userId: user?._id }),
                      {
                        pending: "Verifying your code...",
                        success: "Your email has been successfully verified!",
                        error: "Verification failed. Please try again.",
                      }
                    )
                  }
                  onResend={async () =>
                    await toast.promise(
                      () => sendVerfictionCode({ userId: user?._id }),
                      {
                        pending: "Sending a new verification code...",
                        success:
                          "A new verification code has been sent to your email.",
                        error:
                          "Failed to resend the verification code. Please try again.",
                      }
                    )
                  }
                  availableAfter={
                    user?.resetOtpSendTime
                      ? 15 -
                        Math.floor(
                          (Date.now() - user?.resetOtpSendTime) / (1000 * 60)
                        )
                      : 0
                  }
                />
              </div>
            </div>
          </Modal.Window>
        </Modal>
      )}
    </>
  );
};

export default VerifyModal;
