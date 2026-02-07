import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import PageLayout from "@components/PageLayout";
import Input from "@components/Input";
import Button from "@components/Button";
import DotsLoader from "@components/DotsLoader";
import SectionHeader from "@components/SectionHeader";

import { register as registerAPI } from "@services/auth";
import { ROUTES } from "@constants/routes";
import { passwordRules, regex } from "@constants/regex";
import { contactImages } from "@/constants/images";
import { toast } from "react-toastify";
import clsx from "clsx";
import Icons from "@/components/Icons";

// Define form data type
type RegisterFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confPassword: string;
};

// Yup validation schema
const schema = yup.object({
  name: yup
    .string()
    .matches(regex.userName.regex, regex.userName.message)
    .required("Name is required"),
  email: yup
    .string()
    .matches(regex.email.regex, regex.email.message)
    .required("Email is required"),
  phone: yup
    .string()
    .matches(regex.phone.regex, regex.phone.message)
    .required("Phone is required"),
  password: yup
    .string()
    .matches(regex.password.regex, regex.password.message)
    .required("Password is required"),
  confPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password and confirm password must match")
    .required("Confirm password is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const {
    data,
    mutateAsync: register,
    isPending: isLoading,
  } = useMutation({
    mutationFn: registerAPI,
    onSuccess: () => navigate(ROUTES.LOGIN),
  });

  const {
    register: registerInput,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const passwordValue = watch("password") || "";

  const onSubmit = async (formData: RegisterFormData) => {
    await toast.promise(
      register({
        name: formData.name,
        email: formData.email.toLowerCase(),
        password: formData.password,
        phoneNumber: formData.phone,
        role: "User",
      }),
      {
        pending: "Creating your account...",
        success: "Registered successfully",
        error: {
          render({ data }) {
            return data?.message || "Registration failed. Please try again.";
          },
        },
      }
    );
  };
  return (
    <PageLayout banner={contactImages[0]} caption="register">
      <div className="w-full h-full overflow-y-auto px-8 flex flex-col justify-center max-w-[500px] mx-auto">
        <SectionHeader className="my-10" size="small">
          <h1 className="text-heading-h3">Create Account</h1>
        </SectionHeader>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            placeholder="name"
            register={registerInput("name")}
          />
          <p
            className={clsx(
              "text-red-500 text-medium overflow-hidden transition-all duration-500",
              errors.name?.message
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-full"
            )}
          >
            {errors.name?.message}
          </p>

          <Input
            type="email"
            placeholder="email"
            register={registerInput("email")}
          />
          <p
            className={clsx(
              "text-red-500 text-medium overflow-hidden transition-all duration-500",
              errors.email?.message
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-full"
            )}
          >
            {errors.email?.message}
          </p>

          <Input
            type="text"
            placeholder="phone"
            register={registerInput("phone")}
          />
          <p
            className={clsx(
              "text-red-500 text-medium overflow-hidden transition-all duration-500",
              errors.phone?.message
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-full"
            )}
          >
            {errors.phone?.message}
          </p>

          <Input
            type="password"
            placeholder="password"
            register={registerInput("password")}
          />
          <div className="overflow-hidden">
            <div
              className={clsx(
                "space-y-2 mt-2 text-medium transition-all duration-500",
                touchedFields.password
                  ? "opacity-100 translate-y-0 h-auto"
                  : "opacity-0 -translate-y-full h-0"
              )}
            >
              {passwordRules.map((rule, idx) => {
                const passed = rule.test(passwordValue);
                return (
                  <p key={idx} className={clsx("flex items-center gap-2")}>
                    <span>
                      {passed ? (
                        <Icons.CheckCircle className=" text-green-400" />
                      ) : (
                        <Icons.XCircle className="text-red-400" />
                      )}
                    </span>
                    {rule.label}
                  </p>
                );
              })}
            </div>
          </div>
          <Input
            type="password"
            placeholder="confirm password"
            register={registerInput("confPassword")}
          />
          <p
            className={clsx(
              "text-red-500 text-medium overflow-hidden transition-all duration-500",
              errors.confPassword?.message
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-full"
            )}
          >
            {errors.confPassword?.message}
          </p>

          <Button
            type="primary"
            className="w-full"
            disabled={!isValid || isLoading}
          >
            Register {isLoading && <DotsLoader />}
          </Button>
        </form>

        <p className="font-normal mt-2 text-center text-large">
          <span className="text-primary-muted">Already have an account? </span>
          <Link to={ROUTES.LOGIN} className="font-normal !underline">
            Login here
          </Link>
        </p>
      </div>
    </PageLayout>
  );
};

export default Register;
