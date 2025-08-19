import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

import type { TOrderStatusColors, TPaymentStatusColors } from "@cTypes/orders";

import Loader from "@components/Loader";
import Table from "@components/Table";
import CartProduct from "@/pages/Cart/CartProduct";
import Error from "@components/Error";

import { getOrderDetails } from "@services/order";

import texture from "@images/texture.png";

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetails(orderId || ""),
    enabled: !!orderId,
  });

  if (isLoading) return <Loader />;
  if (!data?.order)
    return <Error message={`No order was found with the ID #${orderId}.`} />;
  if (data?.error) return <Error message={data.error} />;
  return (
    <div
      className="w-full h-full overflow-x-hidden overflow-y-auto lg:pt-48 p-10 lg:px-14 backdrop-brightness-150"
      style={{ backgroundImage: `url(${texture})` }}
    >
      <div className=" space-y-10 mb-10">
        <p>
          order:
          <span className=" font-normal ml-2">#{data?.order?._id}</span>
        </p>
        <p>
          order status:
          <span
            className={`${TOrderStatusColors[data?.order?.orderStatus]} rounded-3xl px-4 py-2 text-center inline-block ml-5 font-normal text-large font-medium`}
          >
            {data?.order?.orderStatus}
          </span>
        </p>
        <p>
          payment status:
          <span
            className={`${TPaymentStatusColors[data?.order?.paymentStatus]} rounded-3xl px-4 py-2 text-center inline-block ml-5 font-normal text-large font-medium`}
          >
            {data?.order?.paymentStatus}
          </span>
        </p>
      </div>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell head={true}>image</Table.Cell>
            <Table.Cell head={true}>name</Table.Cell>
            <Table.Cell head={true}>price</Table.Cell>
            <Table.Cell head={true}>quantity</Table.Cell>
            <Table.Cell head={true}>total price</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {data?.order?.products.map((cartItem) => (
            <CartProduct
              product={cartItem.product}
              quantity={cartItem.quantity}
              key={cartItem.product._id}
              mutationEnabled={false}
            />
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>
              <p className="py-3">Total: </p>
            </Table.Cell>
            <Table.Cell children="" />
            <Table.Cell children="" />
            <Table.Cell children={`x ${data?.order?.totalQuantity}`} />
            <Table.Cell children={`${data?.order?.totalPrice} $`} />
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
};

export default OrderDetails;
