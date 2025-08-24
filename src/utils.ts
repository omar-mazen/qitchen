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

export const isToday = ({ dateString }: { dateString: string }) => {
  const inputDate = new Date(dateString);
  const today = new Date();

  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  );
};

export const isSameTime = ({
  dateString,
  timeString,
}: {
  dateString: string;
  timeString: string;
}) => {
  const date = new Date(dateString);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const formattedTime = `${hours}:${minutes}`;
  return formattedTime === timeString;
};

export const toLocalTime = ({ dateString }: { dateString: string }) => {
  const date = new Date(dateString);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};
