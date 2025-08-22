import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router";

import Loader from "@components/Loader";
import Error from "@components/Error";
import SelectOption from "@components/SelectOptions";
import Table from "@components/Table";
import OrdersTable from "./OrdersTable";

import { OrderStatus } from "@constants/order";
import { DASHBOARD } from "@constants/routes";

import {
  getAllOrders,
  updateOrderStatus as updateOrderStatusAPI,
} from "@services/order";

import type { TOrderStatus } from "@cTypes/orders";

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderStatus = (searchParams.get("order-status") || "Paid") as
    | TOrderStatus
    | "All";
  const page = searchParams.get("page") || 1;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryFn: () =>
      getAllOrders({
        page,
        orderStatus: orderStatus == "All" ? undefined : orderStatus,
        pageSize: 10,
      }),
    queryKey: ["orders", orderStatus, page],
  });
  const { mutateAsync: updateOrderStatus, isPending: orderStatusLoading } =
    useMutation({
      mutationKey: ["orders", orderStatus, page],
      mutationFn: updateOrderStatusAPI,
      onSuccess: () =>
        queryClient.refetchQueries({ queryKey: ["orders", orderStatus, page] }),
    });

  if (isLoading) return <Loader />;
  if (data?.error) return <Error message={data.error} />;
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-10">
        <h1 className=" text-heading-h2">Orders</h1>
        <SelectOption
          disable={isLoading}
          label="select"
          selectedValue={`status: ` + orderStatus || "Paid"}
          setSelectedValue={(value) => {
            searchParams.set("order-status", value);
            setSearchParams(searchParams);
          }}
          options={["All", ...OrderStatus]}
          search={false}
        />
      </div>
      <section>
        {data?.orders?.length && data?.pagination ? (
          <OrdersTable
            isLoading={isLoading || orderStatusLoading}
            pagination={data?.pagination}
          >
            {data?.orders.map((order) => (
              <Table.Row>
                <Table.Cell>
                  <span
                    onClick={() => navigate(`${DASHBOARD.ORDERS}/${order._id}`)}
                    title={order._id}
                    className="inline-block max-w-18 overflow-hidden text-ellipsis cursor-pointer"
                  >
                    {order._id}
                  </span>
                </Table.Cell>
                <Table.Cell>{order.paymentStatus}</Table.Cell>
                <Table.Cell>
                  <SelectOption
                    full={true}
                    label={
                      orderStatus == "All" ? order.orderStatus : orderStatus
                    }
                    options={
                      orderStatus == "All"
                        ? OrderStatus
                        : OrderStatus.slice(
                            OrderStatus.indexOf(orderStatus) + 1
                          )
                    }
                    selectedValue={
                      orderStatus == "All" ? order.orderStatus : orderStatus
                    }
                    setSelectedValue={(value) =>
                      updateOrderStatus({
                        orderId: order._id,
                        status: value as TOrderStatus,
                      })
                    }
                    search={false}
                    disable={orderStatusLoading}
                  />
                </Table.Cell>
                <Table.Cell>
                  {order.products?.map((product) => (
                    <>
                      {product?.product?.name || "deleted item"} x
                      {product.quantity}
                      <br />
                    </>
                  ))}
                </Table.Cell>
                <Table.Cell>{order.totalQuantity}</Table.Cell>
                <Table.Cell>{order.totalPrice}$</Table.Cell>
                <Table.Cell>
                  {order?.address?.governorate} ,{order?.address?.city} ,
                  {order?.address?.street}
                  <br /> building number: {order?.address?.buildingNumber}
                  <br /> flat number: {order?.address?.flatNumber}
                </Table.Cell>
              </Table.Row>
            ))}
          </OrdersTable>
        ) : (
          <div className="flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 w-full px-12 ">
            <h2 className="text-heading-h3 text-center">
              There are no oreders yet with status {orderStatus}.
            </h2>
          </div>
        )}
      </section>
    </div>
  );
};

export default Orders;
