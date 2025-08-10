import { createBrowserRouter, Navigate } from "react-router";
import { ROUTES } from "@constants/routes";
import AppLayout from "@components/AppLayout";
import { lazy } from "react";

const Home = lazy(() => import("@pages/Home"));
const Menu = lazy(() => import("@pages/Menu"));
const Contact = lazy(() => import("@pages/Contact"));
const Reservation = lazy(() => import("@pages/Reservation"));
const About = lazy(() => import("@pages/About"));

const appRoutes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.HOME} /> },
      {
        path: ROUTES.HOME,
        element: <Home />,
      },
      {
        path: ROUTES.MENU,
        element: <Menu />,
      },
      {
        path: ROUTES.CONTACT,
        element: <Contact />,
      },
      {
        path: ROUTES.RESERVATION,
        element: <Reservation />,
      },
      {
        path: ROUTES.ABOUT,
        element: <About />,
      },
    ],
  },
]);

export default appRoutes;
