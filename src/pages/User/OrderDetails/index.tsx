import { useEffect, useState } from "react";
import clsx from "clsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";

import {
  TOrderStatusColors,
  TPaymentStatusColors,
  type TOrderStatus,
} from "@cTypes/orders";

import CartProduct from "@pages/User/Cart/CartProduct";
import Error from "@components/Error";
import OrderTable from "./OrderTable";
import SelectOption from "@/components/SelectOptions";

import { OrderStatus } from "@constants/order";

import { useAuth } from "@/context/Auth";

import {
  getOrderDetails,
  reorder as reorderAPI,
  updateOrderStatus as updateOrderStatusAPI,
} from "@services/order";

import texture from "@images/texture.png";
import Button from "@/components/Button";
import Icons from "@/components/Icons";
import { addProductsToCart as addProductsToCartAPI } from "@/services/cart";
import SmallSpinner from "@/components/SmallSpinner";
import { toast } from "react-toastify";
import { ROUTES } from "@/constants/routes";
import DotsLoader from "@/components/DotsLoader";
import Modal from "@/components/Modal";
import { getUserAdresses } from "@/services/address";
import Address from "@/components/Address";

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
  const { data: addresses, addressesLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: getUserAdresses,
  });
  const navigate = useNavigate();
  const { mutateAsync: updateOrderStatus, isPending: orderStatusLoading } =
    useMutation({
      mutationFn: updateOrderStatusAPI,
      onSuccess: () =>
        queryClient.refetchQueries({ queryKey: ["orders"], exact: false }),
    });
  const {
    mutateAsync: addProductsToCart,
    isPending: addProductsToCartLoading,
  } = useMutation({
    mutationFn: addProductsToCartAPI,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["cart"], exact: false });
      navigate(ROUTES.CART);
    },
  });
  const { mutateAsync: reorder, isPending: reorderLoading } = useMutation({
    mutationFn: reorderAPI,
  });
  const [selectAddressId, setSelectedAddressId] = useState("");

  useEffect(() => {
    if (!selectAddressId) setSelectedAddressId(data?.order?.address._id);
  }, [addresses]);
  if (!data?.order)
    return <Error message={`No order was found with the ID #${orderId}.`} />;
  if (data?.error) return <Error message={data.error} />;

  return (
    <Modal>
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
        {user?.role == "User" && (
          <div className=" flex gap-3 w-full justify-end mt-7">
            {/* ADD TO CART — Primary */}
            <Button
              className="flex items-center justify-center gap-2"
              disabled={addProductsToCartLoading}
              onClick={async () => {
                if (!data.order) return;

                const items = data.order.products.map((item) => ({
                  productId: item.product._id,
                  quantity: item.quantity,
                }));

                await toast.promise(() => addProductsToCart(items), {
                  pending: "Adding items to your cart...",
                  success: "Items added successfully!",
                  error: "Failed to add items. Please try again.",
                });
              }}
            >
              <Icons.Cart className="inline-block" />
              {addProductsToCartLoading ? (
                <span>
                  Adding to Cart <DotsLoader />
                </span>
              ) : (
                <span>Add to Cart</span>
              )}
            </Button>

            {/* REORDER NOW — Secondary/Outline */}
            <Modal.Open opens="choose-address">
              <Button
                type="outline"
                className="flex items-center justify-center gap-2"
              >
                <Icons.Reload />
                <span>reorder now</span>
              </Button>
            </Modal.Open>
          </div>
        )}
      </div>
      <Modal.Window name="choose-address">
        <>
          <div className="flex justify-between items-center mb-10">
            <h2 className=" font-bold text-heading-h3">Choose Address: </h2>
            <Link to={ROUTES.PROFILE}>
              <Button type="outline">Add new address</Button>
            </Link>
          </div>
          <ul className=" space-y-5">
            {addressesLoading && (
              <SmallSpinner color="white" className="mx-auto" />
            )}
            {(addresses?.addresses || []).length > 0 && !addressesLoading ? (
              (addresses?.addresses || []).map((address) => (
                <Address
                  type="presentation"
                  address={address}
                  isSelected={selectAddressId == address._id}
                  setSelectedAddressId={setSelectedAddressId}
                />
              ))
            ) : (
              <div>
                <p className=" text-heading-h4 my-20">
                  You don’t have a saved address yet. Please add one to continue
                  with your order.
                </p>
              </div>
            )}
          </ul>
          <Button
            type="outline"
            className="flex items-center justify-center gap-2 mx-auto mt-5"
            onClick={async () => {
              if (!data.order || !data.order.address?._id) return;

              const items = data.order.products.map((item) => ({
                productId: item.product._id,
                quantity: item.quantity,
              }));

              await toast.promise(
                () =>
                  reorder({
                    addressId: selectAddressId,
                    items,
                  }),
                {
                  pending: "Processing your reorder...",
                  success: "Your reorder was placed successfully!",
                  error: "Reorder failed. Please try again.",
                }
              );
            }}
          >
            {!reorderLoading ? (
              <>
                <Icons.Reload />
                <span>reorder now</span>
              </>
            ) : (
              <span>
                reorder <DotsLoader />
              </span>
            )}
          </Button>
        </>
      </Modal.Window>
    </Modal>
  );
};

export default OrderDetails;
