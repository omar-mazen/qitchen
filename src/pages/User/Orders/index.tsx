import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useSearchParams } from "react-router";

import Error from "@components/Error";
import Button from "@components/Button";

import { getCurrentUserOrders } from "@services/order";

import texture from "@images/texture.png";
import clsx from "clsx";
import { TOrderStatusColors } from "@/types/orders";
import Icons from "@/components/Icons";
import Pagination from "@/components/Pagination";
import SmallSpinner from "@/components/SmallSpinner";
import { useEffect } from "react";
const Orders = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["orders", page],
    queryFn: () => getCurrentUserOrders({ page: page }),
  });
  useEffect(() => {
    if (!data?.pagination) return;
    const totalPages = Number(data.pagination.totalPages);
    const currentPage = Number(data.pagination.currentPage);
    // ✅ Prefetch NEXT page
    if (currentPage < totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["orders", currentPage + 1],
        queryFn: () => getCurrentUserOrders({ page: currentPage + 1 }),
      });
    }

    // ✅ Prefetch PREVIOUS page
    if (currentPage > 1) {
      queryClient.prefetchQuery({
        queryKey: ["orders", currentPage - 1],
        queryFn: () => getCurrentUserOrders({ page: currentPage - 1 }),
      });
    }
  }, [data?.pagination, queryClient]);
  if (data?.error) return <Error message={data.error} />;
  if (isLoading)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <SmallSpinner />
      </div>
    );
  if ((data?.orders || [])?.length <= 0)
    return (
      <div className="h-full px-8 flex flex-col items-center justify-center">
        <p>You haven’t placed any orders yet.</p>
        <Button type="outline">Explore menu and order now</Button>
      </div>
    );

  return (
    <>
      <div
        className="w-full h-full lg:pt-48 p-10 lg:px-14 overflow-x-hidden overflow-y-auto backdrop-brightness-150"
        style={{ backgroundImage: `url(${texture})` }}
      >
        <div className=" container mx-auto space-y-10">
          {data?.orders?.map((order) => (
            <Link to={`/orders/${order._id}`} className="block">
              <div
                key={order._id}
                className=" border border-border rounded-2xl flex flex-col bg-background-muted "
              >
                <div className="flex gap-16 items-stretch p-4 pb-6 ">
                  {/* imgs */}
                  <ul className={clsx("flex items-center", "my-auto")}>
                    {order.products.length < 4 ? (
                      order.products.map((or) => (
                        <li
                          style={{
                            filter: "drop-shadow(-4px 2px 3px black)",
                          }}
                          className="size-20 -mr-5 "
                        >
                          <img
                            src={or.product.images[0]}
                            alt=""
                            className=" rounded-full size-full aspect-square object-cover border-2 border-primary/50"
                          />
                        </li>
                      ))
                    ) : (
                      <>
                        {order.products.slice(0, 3).map((or) => (
                          <li
                            style={{
                              filter: "drop-shadow(-4px 2px 3px black)",
                            }}
                            className="size-20 -mr-5 "
                          >
                            <img
                              src={or.product.images[0]}
                              alt=""
                              className=" rounded-full size-full aspect-square object-cover border-2 border-primary/50"
                            />
                          </li>
                        ))}
                        <li className="ml-8">
                          +{order.products.length - 3} more
                        </li>
                      </>
                    )}
                  </ul>
                  {/* items */}
                  <ul
                    className={clsx(
                      "flex-1 font-normal text-large",
                      order.products.length <= 1 ? "my-auto" : ""
                    )}
                  >
                    {order.products.map((item) => (
                      <li className="p-1">
                        {item.product.name}
                        {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                      </li>
                    ))}
                  </ul>
                  {/* orders status + total price */}
                  <div className="flex flex-col gap-5 items-end justify-between">
                    <span
                      className={clsx(
                        "rounded-full px-4 py-2 text-small font-semibold uppercase tracking-wider ml-auto text-nowrap",
                        TOrderStatusColors[order.orderStatus]
                      )}
                    >
                      {order.orderStatus}
                    </span>
                    {/* <span className="flex items-center gap-2">
                    <Icons.Money />
                    {order.paymentMethod}
                  </span> */}
                    <span>${order.totalPrice}</span>
                  </div>
                </div>
                {/* footer */}
                <div className="flex justify-between items-center rounded-b-2xl bg-primary/20 p-4 text-medium">
                  {/* place type */}
                  <div
                    className={clsx(
                      "flex gap-2",
                      order.placeType == "In-Place"
                        ? "items-end"
                        : "items-center"
                    )}
                  >
                    {order.placeType == "In-Place" && (
                      <>
                        <Icons.ForkAndKnife className="siz-8" /> Dine-in{" "}
                        <Icons.Table className="ml-5 size-8" />
                        {"Table "}
                        {order?.table?.number || 1}{" "}
                      </>
                    )}
                    {order.placeType == "Online" && (
                      <>
                        <Icons.Delivery className="size-12" />{" "}
                        {order.placeType}{" "}
                      </>
                    )}
                    {order.placeType == "Takeaway" && (
                      <>
                        <Icons.Takeaway className="siz-8" />{" "}
                        {order.placeType}{" "}
                      </>
                    )}
                  </div>
                  {/* payment type */}
                  <div className="flex gap-2 items-center">
                    <Icons.Money className="size-8" /> {order.paymentMethod}
                  </div>
                  {/* address */}
                  <div className="flex gap-2 items-center">
                    <Icons.MapIcon className="size-8" />{" "}
                    {order.address.governorate}, {order.address.city},{" "}
                    {order.address.street}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          <Pagination total={Number(data?.pagination?.totalPages)} />
        </div>
      </div>
    </>
  );
};

export default Orders;
