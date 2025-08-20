import type React from "react";

interface IProps {
  type?: React.HTMLInputTypeAttribute;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
  multiple?: boolean;
}

const Input = ({
  type = "text",
  multiple = false,
  placeholder,
  value,
  setValue,
  disabled = false,
}: IProps) => {
  return (
    <input
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      defaultValue={value}
      value={value}
      multiple={multiple}
      onChange={(e) => setValue(e.target.value)}
      className=" w-full border border-border bg-background-muted py-4 px-6 rounded-xl focus:outline-none focus:border-primary/50 focus:shadow-lg focus:shadow-primary/5"
    />
  );
};

export default Input;
