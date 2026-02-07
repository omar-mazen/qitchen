import type React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface IProps {
  type?: React.HTMLInputTypeAttribute;
  placeholder: string;
  value?: string;
  setValue?: (value: string) => void;
  disabled?: boolean;
  multiple?: boolean;
  htmlAttributes?: React.InputHTMLAttributes<HTMLInputElement>;
  register?: UseFormRegisterReturn;
}

const Input = ({
  type = "text",
  multiple = false,
  placeholder,
  value,
  setValue,
  disabled = false,
  htmlAttributes,
  register,
}: IProps) => {
  return (
    <input
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      defaultValue={value}
      value={value}
      multiple={multiple}
      {...htmlAttributes}
      onChange={setValue ? (e) => setValue(e.target.value) : undefined}
      {...register}
      className="font-normal w-full border border-border bg-background-muted py-4 px-6 rounded-xl focus:outline-none focus:border-primary/50 focus:shadow-lg focus:shadow-primary/5"
    />
  );
};

export default Input;
