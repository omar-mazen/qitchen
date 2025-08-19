import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router";

import { useAuth } from "@/context/Auth";

import Input from "@components/Input";
import PageLayout from "@components/PageLayout";
import Button from "@components/Button";
import SectionHeader from "@components/SectionHeader";
import DotsLoader from "@components/DotsLoader";

import { ROUTES } from "@constants/routes";
import { regex } from "@constants/regex";

import banner from "@images/contact/Image (10).png";

type TKey = "email" | "password";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const { login, isLoading, isAuthenticated, error: loginError } = useAuth();
  const handleError = useCallback(
    ({ key, value }: { key: TKey; value: string }) => {
      setError((state) => ({ ...state, [key]: value }));
    },
    [],
  );
  const errorMessage = useMemo(
    () => Object.values(error).filter((str) => str)[0],
    [error],
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
  }, [handleError]);
  if (isAuthenticated) return <Navigate to={ROUTES.HOME} />;
  return (
    <PageLayout banner={banner} caption="Login">
      <div className="w-full h-full overflow-y-auto flex flex-col justify-center px-8">
        <SectionHeader className="mb-10">
          <h2 className=" text-heading-h3">Login</h2>
        </SectionHeader>
        <form
          className="space-y-5 "
          onSubmit={async (e) => {
            e.preventDefault();
            if (!errorMessage) await login({ email, password });
          }}
        >
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
          <div className="flex">
            <p className=" font-normal text-red-400 capitalize">
              {loginError || errorMessage}
            </p>
            <Button
              type="primary"
              className="ml-auto"
              disabled={!!errorMessage || isLoading}
            >
              Login {isLoading && <DotsLoader />}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default Login;
