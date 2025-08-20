import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import Error from "@components/Error";
import { DashboardLayout } from "@components/Layouts";
import ProtectedRoute from "@components/ProtectedRoute";

import { DASHBOARD } from "@constants/routes";

const Products = lazy(() => import("@pages/Dashboard/Products"));

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
          { path: DASHBOARD.ORDERS, element: <p>orders</p> },
          { path: DASHBOARD.PRODUCTS, element: <Products /> },
          { path: DASHBOARD.TABLES, element: <p>tables</p> },
          { path: DASHBOARD.RESERVATION, element: <p>reservation</p> },
        ],
      },
    ],
    errorElement: <Error />,
  },
]);

export default dashboardRoutes;
