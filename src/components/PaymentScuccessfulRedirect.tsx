import { Navigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { ROUTES } from "@constants/routes";
import { verifyPament } from "@services/order";

const PaymentScuccessfulRedirect = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const { isSuccess, isError, data } = useQuery({
    queryKey: [""],
    queryFn: () => verifyPament({ sessionId, orderId }),
    enabled: !!sessionId && !!orderId,
  });
  if (isError) return <p>{data?.error}</p>;
  if (isSuccess) return <Navigate to={`${ROUTES.ORDERS}/${orderId}`} />;
};

export default PaymentScuccessfulRedirect;
