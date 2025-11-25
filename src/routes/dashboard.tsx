import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import Error from "@components/Error";
import { DashboardLayout } from "@components/Layouts";
import ProtectedRoute from "@components/ProtectedRoute";

import { DASHBOARD } from "@constants/routes";

const Home = lazy(() => import("@/pages/Dashboard/Home"));
const MenuManagement = lazy(() => import("@/pages/Dashboard/MenuManagement"));
const Orders = lazy(() => import("@/pages/Dashboard/Orders"));
const Tables = lazy(() => import("@/pages/Dashboard/Tables"));
const Reservations = lazy(() => import("@/pages/Dashboard/Reservations"));
const OrderDetails = lazy(() => import("@/pages/User/OrderDetails"));

const dashboardRoutes = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to={DASHBOARD.HOME} /> },
      {
        element: <ProtectedRoute role="Admin" />,
        children: [
          { path: DASHBOARD.HOME, element: <Home /> },
          { path: DASHBOARD.ORDERS, element: <Orders /> },
          { path: DASHBOARD.ORDER, element: <OrderDetails /> },
          { path: DASHBOARD.MENU_MANAGEMENT, element: <MenuManagement /> },
          { path: DASHBOARD.TABLES, element: <Tables /> },
          { path: DASHBOARD.RESERVATION, element: <Reservations /> },
        ],
      },
    ],
    errorElement: <Error />,
  },
]);

export default dashboardRoutes;
