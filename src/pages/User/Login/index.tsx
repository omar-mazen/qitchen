import { Link, Navigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAuth } from "@/hooks/useAuth";

import Input from "@components/Input";
import PageLayout from "@components/PageLayout";
import Button from "@components/Button";
import SectionHeader from "@components/SectionHeader";
import DotsLoader from "@components/DotsLoader";

import { ROUTES } from "@constants/routes";
import { regex } from "@constants/regex";
import { contactImages } from "@/constants/images";

import Modal from "@/components/Modal";
import ResetPasswordModal from "./ResetPasswordModal";
import { toast } from "react-toastify";
import clsx from "clsx";

/* ---------------- TYPES ---------------- */
type LoginFormData = {
  email: string;
  password: string;
};

/* ---------------- SCHEMA ---------------- */
const schema = yup.object({
  email: yup
    .string()
    .matches(regex.email.regex, regex.email.message)
    .required("Email is required"),
  password: yup
    .string()
    .matches(regex.password.regex, regex.password.message)
    .required("Password is required"),
});

const Login = () => {
  const {
    login,
    isLoginLoading,
    isAuthenticated,
    error: loginError,
  } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const emailValue = watch("email");

  const onSubmit = async (data: LoginFormData) => {
    await toast.promise(
      login({
        email: data.email.toLowerCase(),
        password: data.password,
      }),
      {
        pending: "Signing you in...",
        success: "Logged in successfully",
        error: {
          render({ data }) {
            return data?.message || "Login failed. Please try again.";
          },
        },
      }
    );
  };

  if (isAuthenticated) return <Navigate to={ROUTES.HOME} />;

  return (
    <Modal>
      <PageLayout banner={contactImages[0]} caption="Login">
        <div className="w-full h-full overflow-y-auto flex flex-col justify-center px-8 max-w-[500px] mx-auto">
          <SectionHeader className="mb-10" size="small">
            <h2 className="text-heading-h3">Login</h2>
          </SectionHeader>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="email"
              placeholder="email"
              register={register("email")}
            />
            <p
              className={clsx(
                "text-red-500 text-medium transition-all duration-300",
                errors.email?.message
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              )}
            >
              {errors.email?.message}
            </p>

            <Input
              type="password"
              placeholder="password"
              register={register("password")}
            />
            <p
              className={clsx(
                "text-red-500 text-medium transition-all duration-300",
                errors.password?.message
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              )}
            >
              {errors.password?.message}
            </p>

            <Modal.Open opens="reset-password">
              <p className="font-normal text-large text-right cursor-pointer">
                forgot your password?
              </p>
            </Modal.Open>

            <Button
              type="primary"
              className="w-full"
              disabled={!isValid || isLoginLoading}
            >
              Login {isLoginLoading && <DotsLoader />}
            </Button>

            <p className="font-normal text-red-400 capitalize text-large min-h-32">
              {loginError}
            </p>
          </form>

          <p className="font-normal mt-2 text-center text-large">
            <span className="text-primary-muted">Don’t have an account?</span>{" "}
            <Link to={ROUTES.REGISTER} className="font-normal !underline">
              Sign up here
            </Link>
          </p>
        </div>
      </PageLayout>

      <Modal.Window name="reset-password">
        <ResetPasswordModal email={emailValue || ""} />
      </Modal.Window>
    </Modal>
  );
};

export default Login;
