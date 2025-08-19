import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import PageLayout from "@components/PageLayout";
import Button from "@components/Button";
import SmallSpinner from "@components/SmallSpinner";
import Error from "@components/Error";
import Address from "@components/Address";

import { getUserAdresses } from "@services/address";
import { makeOrder } from "@services/order";

import { useCart } from "@/context/CartContext";

import banner from "@images/menu/menu.png";
import { Link } from "react-router";
import { ROUTES } from "@/constants/routes";

const MakeOrder = () => {
  const [selectAddressId, setSelectedAddressId] = useState("");
  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: getUserAdresses,
  });
  const {
    cart: { totalPrice },
  } = useCart();
  const {
    data,
    mutateAsync: checkout,
    isPending: isCheckoutLoading,
  } = useMutation({
    mutationFn: makeOrder,
  });
  const { cart } = useCart();
  useEffect(() => {
    if (addresses && addresses.addresses)
      setSelectedAddressId(addresses?.addresses[0]._id || "");
  }, [addresses]);
  if (data?.error) return <Error message={data.error} />;
  return (
    <PageLayout banner={banner} caption="order">
      <div className="p-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className=" font-bold text-heading-h3">Choose Address: </h2>
          <Link to={ROUTES.PROFILE}>
            <Button type="outline">Add new address</Button>
          </Link>
        </div>
        <ul className=" space-y-5">
          {isLoading && <SmallSpinner color="white" className="mx-auto" />}
          {addresses?.addresses ? (
            addresses?.addresses.map((address) => (
              <Address
                type="presentation"
                address={address}
                isSelected={selectAddressId == address._id}
                setSelectedAddressId={setSelectedAddressId}
              />
            ))
          ) : (
            <p>
              You don’t have a saved address yet. Please add one to continue
              with your order.
            </p>
          )}
        </ul>
        <div className="flex items-center justify-between my-10">
          <p className="both">Total: {totalPrice}$</p>
          <Button
            type="primary"
            disabled={!totalPrice || isCheckoutLoading}
            onClick={async () => {
              if (!totalPrice) return;
              await checkout({ cartId: cart._id, addressId: selectAddressId });
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
