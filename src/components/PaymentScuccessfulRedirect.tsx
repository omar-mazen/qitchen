import { Navigate, useSearchParams } from "react-router";

import { ROUTES } from "@constants/routes";

const PaymentScuccessfulRedirect = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  console.log(window.location);
  if (orderId) return <Navigate to={`${ROUTES.ORDERS}/${orderId}`} />;
};

export default PaymentScuccessfulRedirect;
