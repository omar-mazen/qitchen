import { useState } from "react";
import clsx from "clsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";

import {
  TOrderStatusColors,
  TPaymentStatusColors,
  type TOrderStatus,
} from "@cTypes/orders";

import Loader from "@components/Loader";
import CartProduct from "@pages/User/Cart/CartProduct";
import Error from "@components/Error";
import OrderTable from "./OrderTable";
import SelectOption from "@/components/SelectOptions";

import { OrderStatus } from "@constants/order";

import { useAuth } from "@/context/Auth";

import {
  getOrderDetails,
  updateOrderStatus as updateOrderStatusAPI,
} from "@services/order";

import texture from "@images/texture.png";

const OrderDetails = () => {
  const { user } = useAuth();
  const { id: orderId } = useParams();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetails(orderId || ""),
    enabled: !!orderId,
  });
  const { mutateAsync: updateOrderStatus, isPending: orderStatusLoading } =
    useMutation({
      mutationFn: updateOrderStatusAPI,
      onSuccess: () =>
        queryClient.refetchQueries({ queryKey: ["orders"], exact: false }),
    });
  if (isLoading) return <Loader />;
  if (!data?.order)
    return <Error message={`No order was found with the ID #${orderId}.`} />;
  if (data?.error) return <Error message={data.error} />;

  return (
    <div
      className={clsx(
        `w-full h-full overflow-x-hidden overflow-y-auto p-8 backdrop-brightness-150`,
        user?.role == "User" && "lg:pt-48  lg:px-14"
      )}
      style={{ backgroundImage: `url(${texture})` }}
    >
      <div className=" space-y-10 mb-10">
        <p>
          order:
          <span className=" font-normal ml-2">#{data?.order?._id}</span>
        </p>
        {user?.role == "Admin" ? (
          <div className="flex items-center gap-5">
            <span>order status:</span>
            <SelectOption
              label={data?.order.orderStatus}
              options={OrderStatus.slice(
                OrderStatus.indexOf(data?.order.orderStatus) + 1
              )}
              selectedValue={status || data?.order.orderStatus}
              setSelectedValue={(value) => {
                setStatus(value);
                updateOrderStatus({
                  orderId: data?.order?._id || "",
                  status: value as TOrderStatus,
                });
              }}
              search={false}
              disable={orderStatusLoading}
            />
          </div>
        ) : (
          <p>
            order status:
            <span
              className={`${TOrderStatusColors[data?.order?.orderStatus]} rounded-3xl px-4 py-2 text-center inline-block ml-5 font-normal text-large font-medium`}
            >
              {data?.order?.orderStatus}
            </span>
          </p>
        )}
        <p>
          payment status:
          <span
            className={`${TPaymentStatusColors[data?.order?.paymentStatus]} rounded-3xl px-4 py-2 text-center inline-block ml-5 font-normal text-large font-medium`}
          >
            {data?.order?.paymentStatus}
          </span>
        </p>
        {user?.role == "Admin" && (
          <>
            <p>
              client name:
              <span className=" font-normal capitalize">
                {" "}
                {data?.order?.buyer.name}
              </span>
            </p>
            <p>
              client phone:
              <span className=" font-normal capitalize">
                {" "}
                {data?.order?.buyer.phoneNumber}
              </span>
            </p>
            <p>
              client address:{" "}
              <span className=" font-normal capitalize">
                {data?.order?.address?.governorate}
              </span>
              {", "}
              <span className=" font-normal capitalize">
                {data?.order?.address?.city}
              </span>
              {", "}
              <span className=" font-normal capitalize">
                {data?.order?.address?.street}
              </span>
            </p>
            <p>
              Building Number:{" "}
              <span className=" font-normal capitalize">
                {data?.order?.address?.buildingNumber}
              </span>
            </p>
            <p>
              Flat Number:{" "}
              <span className=" font-normal capitalize">
                {data?.order?.address?.flatNumber}
              </span>
            </p>
          </>
        )}
      </div>
      <OrderTable
        totalPrice={data?.order.totalPrice}
        totalQuantity={data?.order.totalQuantity}
      >
        {data?.order?.products.map((cartItem) => (
          <CartProduct
            product={cartItem.product}
            quantity={cartItem.quantity}
            key={cartItem.product?._id}
            mutationEnabled={false}
          />
        ))}
      </OrderTable>
    </div>
  );
};

export default OrderDetails;
