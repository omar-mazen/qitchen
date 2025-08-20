import { Navigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { ROUTES } from "@constants/routes";
import { verifyPament } from "@services/order";
import Loader from "./Loader";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

const PaymentScuccessfulRedirect = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  if (orderId) return <Navigate to={`${ROUTES.ORDERS}/${orderId}`} />;
};

export default PaymentScuccessfulRedirect;
