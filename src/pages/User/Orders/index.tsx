import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

import Loader from "@components/Loader";
import Error from "@components/Error";
import Button from "@components/Button";

import { getCurrentUserOrders } from "@services/order";

import texture from "@images/texture.png";
const Orders = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getCurrentUserOrders,
  });
  if (isLoading) return <Loader />;
  if (data?.error) return <Error message={data.error} />;
  return (
    <div
      className="w-full h-full lg:pt-48 p-10 lg:px-14  overflow-x-hidden overflow-y-auto backdrop-brightness-150"
      style={{ backgroundImage: `url(${texture})` }}
    >
      {(data?.orders || [])?.length > 0 ? (
        <div className=" container mx-auto space-y-10">
          {data?.orders?.map((order) => (
            <Link to={`/orders/${order._id}`} className="block">
              <div
                key={order._id}
                className=" border border-border rounded-2xl p-4"
              >
                <p>
                  items:
                  <span className="ml-2 font-normal">
                    {order.products
                      .reduce<
                        string[]
                      >((prev, curr) => [...prev, curr.product?.name], [])
                      .join(",")}
                  </span>
                </p>
                <p>total quantity: {order.totalQuantity}</p>
                <p>total price: {order.totalPrice}$</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="h-full px-8 flex flex-col items-center justify-center">
          <p>You haven’t placed any orders yet.</p>
          <Button type="outline">Explore menu and order now</Button>
        </div>
      )}
    </div>
  );
};

export default Orders;
