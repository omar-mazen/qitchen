import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import PageLayout from "@components/PageLayout";
import Input from "@components/Input";
import Button from "@components/Button";
import { ROUTES } from "@constants/routes";
import DotsLoader from "@components/DotsLoader";
import SectionHeader from "@components/SectionHeader";

import { register as registerAPI } from "@services/auth";

import { regex } from "@constants/regex";

import banner from "@images/contact/Image (10).png";

type TKey = "name" | "email" | "password" | "confPassword" | "phone";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [error, setError] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confPassword: "",
  });
  const navigate = useNavigate();
  const {
    data,
    mutateAsync: register,
    isPending: isLoading,
  } = useMutation({
    mutationFn: registerAPI,
    onSuccess: () => navigate(ROUTES.LOGIN),
  });
  const handleError = useCallback(
    ({ key, value }: { key: TKey; value: string }) => {
      setError((state) => ({ ...state, [key]: value }));
    },
    []
  );
  const errorMessage = useMemo(
    () => Object.values(error).filter((str) => str)[0],
    [error]
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
    [handleError]
  );
  useEffect(() => {
    handleInput({
      key: "name",
      value: name,
      setValue: () => {},
      regex: regex.userName.regex,
      message: regex.userName.message,
    });
    handleInput({
      key: "email",
      value: email,
      setValue: () => {},
      regex: regex.email.regex,
      message: regex.email.message,
    });
    handleInput({
      key: "password",
      value: password,
      setValue: () => {},
      regex: regex.password.regex,
      message: regex.password.message,
    });
    handleInput({
      key: "confPassword",
      value: confPassword,
      setValue: () => {},
      regex: regex.password.regex,
      message: regex.password.message,
    });
    handleInput({
      key: "phone",
      value: phone,
      setValue: () => {},
      regex: regex.phone.regex,
      message: regex.phone.message,
    });
  }, [name, email, password, confPassword, phone, handleError, handleInput]);
  useEffect(() => {
    if (
      password !== confPassword &&
      !!password &&
      !!confPassword &&
      !error.confPassword
    ) {
      handleError({
        key: "confPassword",
        value: "password and confirm password must match.",
      });
    }
  }, [password, confPassword, handleError, error]);
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!errorMessage)
        await register({
          name,
          email,
          password,
          phoneNumber: phone,
          role: "User",
        });
    },
    [name, password, email, phone, errorMessage, register]
  );
  return (
    <PageLayout banner={banner} caption="register">
      <div className="w-full h-full overflow-y-auto px-8 flex flex-col justify-center">
        <SectionHeader className="my-10">
          <h1 className=" text-heading-h3"> create account </h1>
        </SectionHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="name"
            value={name}
            setValue={(value) =>
              handleInput({
                key: "name",
                value,
                setValue: setName,
                regex: regex.userName.regex,
                message: regex.userName.message,
              })
            }
          />
          <Input
            type="email"
            placeholder="email"
            value={email}
            setValue={(value) =>
              handleInput({
                key: "email",
                value,
                setValue: setEmail,
                regex: regex.email.regex,
                message: regex.email.message,
              })
            }
          />
          <Input
            type="text"
            placeholder="phone"
            value={phone}
            setValue={(value) =>
              handleInput({
                key: "phone",
                value,
                setValue: setPhone,
                regex: regex.phone.regex,
                message: regex.phone.message,
              })
            }
          />
          <Input
            type="password"
            placeholder="password"
            value={password}
            setValue={(value) =>
              handleInput({
                key: "password",
                value,
                setValue: setPassword,
                regex: regex.password.regex,
                message: regex.password.message,
              })
            }
          />
          <Input
            type="password"
            placeholder="confirm password"
            value={confPassword}
            setValue={(value) =>
              handleInput({
                key: "confPassword",
                value,
                setValue: setConfPassword,
                regex: regex.password.regex,
                message: regex.password.message,
              })
            }
          />

          <div className="flex">
            <p className=" font-normal text-red-400 capitalize">
              {data?.error || errorMessage}
            </p>
            <Button
              type="primary"
              className="ml-auto"
              disabled={!!errorMessage || isLoading}
            >
              register {isLoading && <DotsLoader />}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default Register;
