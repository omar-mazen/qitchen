import Button from "@/components/Button";
import ContextMenu from "@/components/ContextMenu";
import DropdownButton from "@/components/DropdownButton";
import Icons from "@/components/Icons";
import type { ReceiptRef } from "@/components/Receipt";
import Receipt from "@/components/Receipt";
import SmallSpinner from "@/components/SmallSpinner";
import { OrderStatus } from "@/constants/order";
import { useAuth } from "@/context/Auth";
import { getOrdersByStatus, updateOrderStatus } from "@/services/order";
import {
  TOrderStatusColors,
  type TOrder,
  type TOrderStatus,
} from "@/types/orders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useCallback, useRef, useState } from "react";

const ActiveOrders = ({ status }) => {
  const { data: ordersByStatus, isLoading: isLoading } = useQuery({
    queryKey: ["ordersBuyStatus", "orders", status],
    queryFn: () =>
      getOrdersByStatus({ page: 1, pageSize: 10, orderStatus: status }),
  });
  const [collapsed, setCollapsed] = useState([]);
  const isCollapsed = useCallback(
    (stats) => collapsed.includes(stats),
    [collapsed]
  );

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <SmallSpinner color="white" />
      </div>
    );
  return (
    <>
      <ContextMenu alignment="left">
        <div>
          {ordersByStatus?.orders?.map((order) => (
            <>
              <div
                className={clsx(
                  "flex items-center gap-3 cursor-pointer text-heading-h4 first:pb-5 py-5 select-none"
                )}
                onClick={() =>
                  setCollapsed((st) =>
                    isCollapsed(order.status)
                      ? st.filter((status) => status != order.status)
                      : [...st, order.status]
                  )
                }
              >
                <span
                  className={clsx(
                    "inline-block w-0 h-0 border-4 border-transparent ",
                    isCollapsed(order.status)
                      ? "border-l-primary"
                      : "border-t-primary"
                  )}
                ></span>
                <p>{order?.status}</p>
              </div>
              {!isCollapsed(order.status) && (
                <div className="grid grid-cols-2 gap-7">
                  {order?.orders.map((order) => (
                    <OrderCard order={order} />
                  ))}
                </div>
              )}
            </>
          ))}
        </div>
      </ContextMenu>
    </>
  );
};

const OrderCard = ({ order }: { order: TOrder }) => {
  const [newStatus, setNewStatus] = useState<TOrderStatus>(
    () =>
      OrderStatus[
        OrderStatus.indexOf(order.orderStatus) +
          (order.orderStatus == OrderStatus[-1] ? 0 : 1)
      ]
  );
  const receiptRef = useRef<ReceiptRef>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { mutateAsync: updateStatus, isPending } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () =>
      queryClient.refetchQueries({
        queryKey: ["orders"],
        exact: false,
      }),
  });
  return (
    <>
      <div className="rounded-2xl border border-border bg-border/20 #backdrop-blur-2xl py-6 px-8 capitalize font-normal h-full flex flex-col">
        <div className="flex items-center pb-4">
          <p className="flex items-center uppercase">
            order #
            <span
              title={order._id}
              className="inlin-block text-nowrap w-36 text-ellipsis overflow-hidden cursor-pointer "
            >
              {order._id}
            </span>
          </p>
          <span
            className={clsx(
              "rounded-full px-4 py-2 text-small font-semibold uppercase tracking-wider ml-auto",
              TOrderStatusColors[order.orderStatus]
            )}
          >
            {order.orderStatus}
          </span>
        </div>
        <ul className="space-y-2">
          <li>
            time:
            <span className="ml-2 font-thin text-xlarge text-primary/70">
              {new Date(order.createdAt).toLocaleString("en-us", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </li>
          <li>
            client:
            <span className="ml-2 font-normal font-thin text-xlarge text-primary/70">
              {order.buyer.name}
            </span>
          </li>
          <li>
            address:
            <span className="ml-2 font-normal font-thin text-xlarge text-primary/70">
              {order.address?.city}, st.{order.address?.street}. building:{" "}
              {order.address?.buildingNumber} flat: {order.address?.flatNumber}
            </span>
          </li>
        </ul>
        <div className="grid grid-cols-[70%_30%] py-4">
          <p>order item</p>
          <p className=" place-self-end">amount</p>
        </div>
        <ul className=" divide-border divide-y border-b border-t border-border">
          {order.products.map((order) => (
            <li className="grid grid-cols-[70%_30%] py-4">
              <p>
                {order.product?.name || "deleted item"} × {order.quantity}
              </p>
              <p className=" place-self-end">
                {+order.product?.price || 0 * +order.quantity} $
              </p>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-[70%_30%] py-4 mt-auto">
          <span>Total Amont:</span>
          <span className="place-self-end">{order.totalPrice} $</span>
        </div>
        <div className="flex gap-5">
          <DropdownButton
            buttonText={
              <>
                mark as <strong className="lowercase">{newStatus}</strong>
              </>
            }
            items={OrderStatus}
            onSubmit={() =>
              updateStatus({ orderId: order._id, status: newStatus })
            }
            onSelected={(item) => {
              setNewStatus(item as TOrderStatus);
            }}
            disabled={isPending}
          />
          <Button
            className="!w-auto !h-full aspect-square text-center"
            type="outline"
            onClick={() => {
              receiptRef.current?.print();
            }}
            rest={{ title: "print receipt" }}
          >
            <Icons.Receipt className=" cursor-pointer size-6" />
          </Button>
        </div>
      </div>
      <Receipt
        address="Alexandria, Egypt"
        user={{
          name: order.buyer.name,
          phone: order.buyer.phoneNumber,
          address: (
            <>
              {order.address?.city}, st.{order.address?.street}. building:{" "}
              {order.address?.buildingNumber} flat: {order.address?.flatNumber}
            </>
          ),
        }}
        items={order.products.map((ord) => ({
          name: ord?.product?.name || "deleted product",
          price: ord.product?.price || 0,
          qty: ord?.quantity,
        }))}
        vatPercent={16}
        servicePercent={2}
        staff={user?.name}
        ref={receiptRef}
        orderId={order._id}
      />
    </>
  );
};
export default ActiveOrders;
