import { Navigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { ROUTES } from "@constants/routes";
import { verifyPament } from "@services/order";
import Loader from "./Loader";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

const PaymentScuccessfulRedirect = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const { isSuccess, data, isLoading } = useQuery({
    queryKey: [""],
    queryFn: () => {
      if (!sessionId || !orderId)
        throw new Error("Missing session or order ID");
      return verifyPament({ sessionId, orderId });
    },
    enabled: !!sessionId && !!orderId,
  });
  useEffect(() => clearCart(), [isSuccess]);
  if (data?.error) return <p>{data.error}</p>;
  if (isLoading) return <Loader />;
  if (isSuccess) return <Navigate to={`${ROUTES.ORDERS}/${orderId}`} />;
};

export default PaymentScuccessfulRedirect;
