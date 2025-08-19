import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useMutation } from "@tanstack/react-query";

import Button from "@components/Button";
import DotsLoader from "@components/DotsLoader";
import Input from "@components/Input";
import SectionHeader from "@components/SectionHeader";

import { regex } from "@constants/regex";
import { updatePassword as updatePasswordAPI } from "@services/user";

type TKey = "old" | "new" | "confirm";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutate: updatePassword, isPending: isUpdating } = useMutation({
    mutationFn: updatePasswordAPI,
  });
  const [error, setError] = useState({
    old: "",
    new: "",
    confirm: "",
  });
  const errorMessage = useMemo(
    () => Object.values(error).filter((str) => str)[0],
    [error]
  );
  const handleError = useCallback(
    ({ key, value }: { key: TKey; value: string }) => {
      setError((state) => ({ ...state, [key]: value }));
    },
    []
  );
  const handlePassword = useCallback(
    ({
      key,
      value,
      setValue,
      regex,
      message,
    }: {
      key: TKey;
      value: string;
      setValue: (value: string) => void;
      regex: RegExp;
      message: string;
    }) => {
      if (regex.test(value)) {
        setValue(value);
        handleError({ key, value: "" });
      } else {
        setValue(value);
        handleError({ key, value: message });
      }
    },
    [handleError]
  );
  const disabled = useMemo(
    () => !!errorMessage || !(oldPassword || newPassword || confirmPassword),
    [errorMessage, oldPassword, newPassword, confirmPassword]
  );
  useEffect(() => {
    if (!!newPassword && !!confirmPassword && !error.confirm) {
      if (oldPassword === newPassword) {
        handleError({
          key: "new",
          value: "New password cannot be the same as your current password.",
        });
      } else if (newPassword !== confirmPassword) {
        handleError({
          key: "confirm",
          value: "New password and confirm password must match.",
        });
      }
    }
  }, [handleError, oldPassword, confirmPassword, newPassword, error]);
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (disabled) return;
      updatePassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    [
      disabled,
      updatePassword,
      setOldPassword,
      setNewPassword,
      setConfirmPassword,
      oldPassword,
      newPassword,
    ]
  );
  return (
    <div className=" space-y-5">
      <SectionHeader>change password</SectionHeader>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="password"
          placeholder="old password"
          value={oldPassword}
          disabled={isUpdating}
          setValue={(value) =>
            handlePassword({
              key: "old",
              value,
              setValue: setOldPassword,
              regex: regex.password.regex,
              message: regex.password.message,
            })
          }
        />
        <Input
          type="password"
          disabled={isUpdating}
          placeholder="new password"
          value={newPassword}
          setValue={(value) =>
            handlePassword({
              key: "new",
              value,
              setValue: setNewPassword,
              regex: regex.password.regex,
              message: regex.password.message,
            })
          }
        />
        <Input
          type="password"
          placeholder="confirm password"
          disabled={isUpdating}
          value={confirmPassword}
          setValue={(value) =>
            handlePassword({
              key: "confirm",
              value,
              setValue: setConfirmPassword,
              regex: regex.password.regex,
              message: regex.password.message,
            })
          }
        />
        <div className="flex items-center justify-between">
          <p className=" font-normal text-red-400 capitalize">{errorMessage}</p>
          <Button type="primary" disabled={disabled || isUpdating}>
            update {isUpdating ? <DotsLoader /> : ""}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
