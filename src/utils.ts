import axios from "axios";

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
