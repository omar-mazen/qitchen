import { createBrowserRouter, Navigate } from "react-router";
import { ROUTES } from "@constants/routes";
// import { UserAppLayout } from "@/components/Layouts";
import { lazy, Suspense } from "react";
import PaymentScuccessfulRedirect from "@components/PaymentScuccessfulRedirect";
import Error from "@/components/Error";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/Loader";

const UserAppLayout = lazy(() => import("@components/Layouts/UserAppLayout"));
const Register = lazy(() => import("@/pages/User/Register"));
const Login = lazy(() => import("@/pages/User/Login"));
const ResetPassword = lazy(() => import("@/pages/User/ResetPassword"));
const Home = lazy(() => import("@/pages/User/Home"));
const Menu = lazy(() => import("@/pages/User/Menu"));
const Contact = lazy(() => import("@/pages/User/Contact"));
const Reservation = lazy(() => import("@/pages/User/Reservation"));
const About = lazy(() => import("@/pages/User/About"));
const Profile = lazy(() => import("@/pages/User/Profile"));
const Product = lazy(() => import("@/pages/User/Product"));
const Cart = lazy(() => import("@/pages/User/Cart"));
const MakeOrder = lazy(() => import("@/pages/User/MakeOrder"));
const Orders = lazy(() => import("@/pages/User/Orders"));
const OrderDetails = lazy(() => import("@/pages/User/OrderDetails"));

const userRoutes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <UserAppLayout />
      </Suspense>
    ),
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
        path: ROUTES.RESET_PASSWORD,
        element: <ResetPassword />,
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
          {
            path: ROUTES.RESERVATION,
            element: <Reservation />,
          },
        ],
      },
    ],
    errorElement: <Error />,
  },
]);

export default userRoutes;
