import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

import Button from "@components/Button";
import DotsLoader from "@components/DotsLoader";
import Input from "@components/Input";
import SectionHeader from "@components/SectionHeader";

import { useAuth } from "@/context/Auth";

import { regex } from "@constants/regex";

import { updateUser as updateUserAPI } from "@services/user";

type TKey = "name" | "phone" | "email" | "submit";
const UserData = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [error, setError] = useState({
    name: "",
    phone: "",
    submit: "",
  });
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationKey: ["user"],
    mutationFn: updateUserAPI,
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["user"] }),
  });
  const hasUpdate =
    (name != user?.name || phone != user?.phoneNumber) &&
    !(error.name && error.phone);
  const errorMessage = useMemo(
    () => Object.values(error).filter((str) => str)[0],
    [error],
  );

  const handleError = useCallback(
    ({ key, value }: { key: TKey; value: string }) => {
      setError((state) => ({ ...state, [key]: value }));
    },
    [],
  );
  const handleInput = useCallback(
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
    [handleError],
  );
  useEffect(() => {
    handleInput({
      key: "name",
      value: user?.name || "",
      setValue: setName,
      regex: regex.userName.regex,
      message: regex.userName.message,
    });
    handleInput({
      key: "email",
      value: user?.email || "",
      setValue: setEmail,
      regex: regex.email.regex,
      message: regex.email.message,
    });
    handleInput({
      key: "phone",
      value: user?.phoneNumber || "",
      setValue: setPhone,
      regex: regex.phone.regex,
      message: regex.phone.message,
    });
  }, [handleInput, user]);
  const handleSubmit = useCallback(async () => {
    if (!hasUpdate) return;
    updateUser({ name, phoneNumber: phone });
  }, []);
  return (
    <div className=" space-y-5">
      <SectionHeader>User</SectionHeader>
      <form action="" className="space-y-5" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="user name"
          value={name}
          disabled={isUpdating}
          setValue={(value) => {
            handleInput({
              key: "name",
              value,
              setValue: setName,
              regex: regex.userName.regex,
              message: regex.userName.message,
            });
          }}
        />
        <Input
          type="email"
          disabled={true}
          placeholder="email"
          value={email}
          setValue={() => {}}
        />
        <Input
          type="text"
          placeholder="phone"
          value={phone}
          disabled={isUpdating}
          setValue={(value) => {
            handleInput({
              key: "phone",
              value,
              setValue: setPhone,
              regex: regex.phone.regex,
              message: regex.phone.message,
            });
          }}
        />
        <div className="flex items-center justify-between">
          <p className=" font-normal text-red-400 capitalize">{errorMessage}</p>
          <Button type="primary" disabled={!hasUpdate || isUpdating}>
            update {isUpdating ? <DotsLoader /> : ""}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserData;
