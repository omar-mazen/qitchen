import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import PageLayout from "@components/PageLayout";
import Button from "@components/Button";
import SmallSpinner from "@components/SmallSpinner";
import Error from "@components/Error";
import Address from "@components/Address";
import SectionHeader from "@components/SectionHeader";
import CheckoutProductCard from "./CheckoutProductCard";

import { getUserAdresses } from "@services/address";
import { makeOrder } from "@services/order";

import { useCart } from "@/context/CartContext";

import banner from "@images/menu/menu.png";
import { Link } from "react-router";
import { ROUTES } from "@/constants/routes";

const MakeOrder = () => {
  const [selectAddressId, setSelectedAddressId] = useState("");
  const { cart } = useCart();
  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: getUserAdresses,
  });
  const {
    cart: { totalPrice, products },
  } = useCart();
  const {
    data,
    mutateAsync: checkout,
    isPending: isCheckoutLoading,
  } = useMutation({
    mutationFn: makeOrder,
  });
  useEffect(() => {
    if (addresses && addresses.addresses)
      setSelectedAddressId(addresses?.addresses[0]?._id || "");
  }, [addresses]);
  if (data?.error) return <Error message={data.error} />;
  return (
    <PageLayout banner={banner} caption="order">
      <div className="p-4 px-8 overflow-y-auto h-full">
        {/* address handling */}
        <>
          <div className="flex justify-between items-center mb-10">
            <h2 className=" font-bold text-heading-h3">Choose Address: </h2>
            <Link to={ROUTES.PROFILE}>
              <Button type="outline">Add new address</Button>
            </Link>
          </div>
          <ul className=" space-y-5">
            {isLoading && <SmallSpinner color="white" className="mx-auto" />}
            {(addresses?.addresses || []).length > 0 && !isLoading ? (
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
        </>
        {/* order items */}
        {cart.products.length > 0 ? (
          <>
            <SectionHeader className="my-10">order</SectionHeader>
            <div className="space-y-5 my-10">
              {products.map((product) => (
                <CheckoutProductCard product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-10 items-center justify-center my-10">
            <p className="text-heading-h3">
              Your cart is empty. Start adding items to place an order.
            </p>
            <Link to="/menu">
              <Button type="outline">Browse menu</Button>
            </Link>
          </div>
        )}
        {/* check out button  and total price*/}
        <div className="flex items-center justify-between my-10">
          <p className="both">Total: {totalPrice}$</p>
          <Button
            type="primary"
            disabled={
              !totalPrice ||
              isCheckoutLoading ||
              (addresses?.addresses || [])?.length <= 0
            }
            onClick={async () => {
              if (!totalPrice) return;
              if (cart._id)
                await checkout({
                  cartId: cart._id,
                  addressId: selectAddressId,
                });
            }}
          >
            checkout
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default MakeOrder;
