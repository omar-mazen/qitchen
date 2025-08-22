import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import Error from "@components/Error";
import { DashboardLayout } from "@components/Layouts";
import ProtectedRoute from "@components/ProtectedRoute";

import { DASHBOARD } from "@constants/routes";
import OrderDetails from "@/pages/User/OrderDetails";

const MenuManagement = lazy(() => import("@/pages/Dashboard/MenuManagement"));
const Orders = lazy(() => import("@/pages/Dashboard/Orders"));

const dashboardRoutes = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to={DASHBOARD.HOME} /> },
      {
        element: <ProtectedRoute role="Admin" />,
        children: [
          { path: DASHBOARD.HOME, element: <p>home</p> },
          { path: DASHBOARD.ORDERS, element: <Orders /> },
          { path: DASHBOARD.ORDER, element: <OrderDetails /> },
          { path: DASHBOARD.MENU_MANAGEMENT, element: <MenuManagement /> },
          { path: DASHBOARD.TABLES, element: <p>tables</p> },
          { path: DASHBOARD.RESERVATION, element: <p>reservation</p> },
        ],
      },
    ],
    errorElement: <Error />,
  },
]);

export default dashboardRoutes;
