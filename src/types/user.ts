export type TRoles = "User" | "Admin";
export type TUser = {
  _id: string;
  email: string;
  name: string;
  role: TRoles;
  phoneNumber?: string;
  address?: string;
};
export type GetCurrentUserDataResult = {
  user?: TUser;
  error?: string;
};
export type LoginParams = {
  email: string;
  password: string;
};
export type LoginResult = {
  success?: boolean;
  message?: string;
  user?: TUser;
  error?: string;
};
