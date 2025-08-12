export type TRoles = "User" | "Admin";
export type TUser = {
  _id: string;
  email: string;
  name: "string";
  role: TRoles;
  PhoneNumber?: string;
  address?: string;
};
export type GetCurrentUserDataResult = {
  user?: TUser;
  error?: string;
};
