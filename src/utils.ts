import axios from "axios";
import type React from "react";

export const handleError = (error: unknown): { error: string } => {
  if (axios.isAxiosError(error)) {
    return {
      error:
        error.response?.data?.message ||
        `Request failed with status ${error.response?.status}`,
    };
  }
  return { error: "Unexpected error occurred" };
};

export const handleInputError = <T>({
  key,
  value,
  setError,
}: {
  key: string;
  value: string;
  setError: React.Dispatch<React.SetStateAction<T>>;
}) => {
  setError((state: T) => ({ ...state, [key]: value }));
};

export const handleInput = <T>({
  key,
  value,
  setValue,
  regex,
  setError,
}: {
  key: string;
  value: string;
  setValue: (value: string) => void;
  regex: { regex: RegExp; message: string };
  setError: React.Dispatch<React.SetStateAction<T>>;
}) => {
  if (regex.regex.test(value)) {
    setValue(value);
    handleInputError<T>({ key, value: "", setError });
  } else {
    setValue(value);
    handleInputError<T>({ key, value: regex.message, setError });
  }
};
