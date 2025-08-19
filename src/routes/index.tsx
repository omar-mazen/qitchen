import { createBrowserRouter, Navigate } from "react-router";
import { ROUTES } from "@constants/routes";
import AppLayout from "@components/AppLayout";
import { lazy } from "react";
import PaymentScuccessfulRedirect from "@components/PaymentScuccessfulRedirect";
import Error from "@/components/Error";
import ProtectedRoute from "@/components/ProtectedRoute";

const Register = lazy(() => import("@pages/Register"));
const Login = lazy(() => import("@pages/Login"));
const Home = lazy(() => import("@pages/Home"));
const Menu = lazy(() => import("@pages/Menu"));
const Contact = lazy(() => import("@pages/Contact"));
const Reservation = lazy(() => import("@pages/Reservation"));
const About = lazy(() => import("@pages/About"));
const Profile = lazy(() => import("@pages/Profile"));
const Product = lazy(() => import("@pages/Product"));
const Cart = lazy(() => import("@pages/Cart"));
const MakeOrder = lazy(() => import("@pages/MakeOrder"));
const Orders = lazy(() => import("@pages/Orders"));
const OrderDetails = lazy(() => import("@pages/OrderDetails"));

const appRoutes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.HOME} /> },
      {
        path: ROUTES.REGISTER,
        element: <Register />,
      },
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
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

      {
        path: ROUTES.PRODUCT,
        element: <Product />,
      },
      {
        path: ROUTES.CART,
        element: <Cart />,
      },
      {
        path: "/payment/success",
        element: <PaymentScuccessfulRedirect />,
      },
      {
        element: <ProtectedRoute role="User" />,
        children: [
          {
            path: ROUTES.PROFILE,
            element: <Profile />,
          },
          {
            path: ROUTES.MAKE_ORDER,
            element: <MakeOrder />,
          },
          {
            path: ROUTES.ORDERS,
            element: <Orders />,
          },
          {
            path: ROUTES.ORDER_DETAILS,
            element: <OrderDetails />,
          },
        ],
      },
    ],
    errorElement: <Error />,
  },
]);

export default appRoutes;
