import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import Error from "@components/Error";
import { DashboardLayout } from "@components/Layouts";
import ProtectedRoute from "@components/ProtectedRoute";
import { RouteWithSuspense } from "./RouteWithSuspense";

import { DASHBOARD } from "@constants/routes";

const Home = lazy(() => import("@/pages/Dashboard/Home"));
const MenuManagement = lazy(() => import("@/pages/Dashboard/MenuManagement"));
const Orders = lazy(() => import("@/pages/Dashboard/Orders"));
const Tables = lazy(() => import("@/pages/Dashboard/Tables"));
const Settings = lazy(() => import("@/pages/Dashboard/Settings"));
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
          {
            path: DASHBOARD.HOME,
            element: <RouteWithSuspense element={<Home />} />,
          },
          {
            path: DASHBOARD.ORDERS,
            element: <RouteWithSuspense element={<Orders />} />,
          },
          {
            path: DASHBOARD.ORDER,
            element: <RouteWithSuspense element={<OrderDetails />} />,
          },
          {
            path: DASHBOARD.MENU_MANAGEMENT,
            element: <RouteWithSuspense element={<MenuManagement />} />,
          },
          {
            path: DASHBOARD.SETTINGS,
            element: <RouteWithSuspense element={<Settings />} />,
          },
          {
            path: DASHBOARD.TABLES,
            element: <RouteWithSuspense element={<Tables />} />,
          },
          {
            path: DASHBOARD.RESERVATION,
            element: <RouteWithSuspense element={<Reservations />} />,
          },
        ],
      },
    ],
    errorElement: <Error />,
  },
]);

export default dashboardRoutes;
