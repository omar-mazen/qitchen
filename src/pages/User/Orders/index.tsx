import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

import Loader from "@components/Loader";
import Error from "@components/Error";
import Button from "@components/Button";

import { getCurrentUserOrders } from "@services/order";

import texture from "@images/texture.png";
import clsx from "clsx";
import { OrderStatus } from "@/constants/order";
import { TOrderStatusColors } from "@/types/orders";
import Icons from "@/components/Icons";
const Orders = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getCurrentUserOrders,
  });
  //  if (isLoading) return <Loader />;
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
                <div className="flex items-start justify-between gap-5">
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
                  <span
                    className={clsx(
                      "rounded-full px-4 py-2 text-small font-semibold uppercase tracking-wider ml-auto text-nowrap",
                      TOrderStatusColors[order.orderStatus]
                    )}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-5 mt-5 flex-wrap">
                  <p className="mt-3 text-nowrap">
                    total quantity: {order.totalQuantity}
                  </p>
                  <p className="text-nowrap">
                    total price: {order.totalPrice}$
                  </p>
                </div>
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
