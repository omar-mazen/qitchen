export const ROUTES = {
  REGISTER: "/register",
  LOGIN: "/login",
  HOME: "/home",
  MENU: "/menu",
  CONTACT: "/contact",
  RESERVATION: "/reservation",
  ABOUT: "/about",
  PRODUCT: "/product/:id",
  CART: "/cart",
  PROFILE: "/profile",
  MAKE_ORDER: "/make-order",
  ORDERS: "/orders",
  ORDER_DETAILS: "/orders/:id",
} as const;

export const DASHBOARD = {
  HOME: "/dashboard/home",
  MENU_MANAGEMENT: "/dashboard/menu-management",
  ORDERS: "/dashboard/orders",
  TABLES: "/dashboard/tables",
  RESERVATION: "/dashboard/reservation",
};
