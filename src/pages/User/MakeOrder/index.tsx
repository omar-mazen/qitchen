import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router";
import clsx from "clsx";

import PageLayout from "@components/PageLayout";
import Button from "@components/Button";
import SmallSpinner from "@components/SmallSpinner";
import PlaceTypeSelector from "@/components/PlaceTypeSelector";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";

import {
  getUserAdresses,
  addAddress as addAddressAPI,
} from "@services/address";
import { makeOrder } from "@services/order";

import { useCart } from "@/context/CartContext";
import { MenuImages } from "@/constants/images";
import type { TPaymentMethod, TPlaceType } from "@/types/orders";
import ContextMenu from "@/components/ContextMenu";
import Address from "@/components/Address";
import type { TAddress } from "@/types/address";
import { toast } from "react-toastify";
import Modal from "@/components/Modal";
import NewAddress from "../Profile/NewAddress";
import Table from "@/components/Table";
import type { TCARTProduct } from "@/types/cart";

// Yup Schema
const schema = yup.object({
  placeType: yup.mixed<TPlaceType>().required("Please select place type"),
  paymentMethod: yup
    .string<TPaymentMethod>()
    .required("Please select payment method"),
  addressId: yup.string().when("placeType", {
    is: "Online",
    then: (schema) => schema.required("Please select delivery address"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

type FormValues = {
  placeType: TPlaceType;
  paymentMethod: TPaymentMethod;
  addressId: string;
};

export type TNewAddress = {
  governorate: string;
  city: string;
  street: string;
  flatNumber: string | number;
  buildingNumber: string | number;
};

const initialAddress = {
  governorate: "",
  city: "",
  street: "",
  flatNumber: "",
  buildingNumber: "",
};

const MakeOrder = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newAddress, setNewAddress] = useState<TNewAddress>(initialAddress);

  const { data: addresses, isLoading: addressesLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: getUserAdresses,
  });

  const { mutateAsync: addAddress, isPending: isAddingAddress } = useMutation({
    mutationKey: ["addresses"],
    mutationFn: addAddressAPI,
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["addresses"] }),
  });

  const { mutateAsync: checkout, isPending: isCheckoutLoading } = useMutation({
    mutationFn: makeOrder,
    onSuccess: (data) => {
      if (data.session_url) navigate(data.session_url);
      else navigate(`/orders/${data.order._id}`);
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    watch,
  } = useForm<FormValues>({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      placeType: undefined,
      paymentMethod: undefined,
      addressId: "",
    },
  });

  // Watch both placeType and addressId
  const placeType = useWatch({ control, name: "placeType" });
  const addressId = useWatch({ control, name: "addressId" });

  // Check if new address form is valid
  const canAddAddress = Object.values(newAddress).reduce(
    (prev, curr) => prev && !!curr,
    true
  );

  // Clear addressId when switching away from ONLINE
  useEffect(() => {
    if (placeType !== "Online") {
      setValue("addressId", "");
    }
    // Revalidate when placeType changes
    trigger("addressId");
  }, [placeType, setValue, trigger]);

  // Set default address when addresses load
  useEffect(() => {
    if (addresses?.addresses?.length && placeType === "Online" && !addressId) {
      // Optionally auto-select first address
      // setValue("addressId", addresses.addresses[0]._id);
    }
  }, [addresses, placeType, addressId, setValue]);

  // Check if form is valid for submission
  const isFormValid = () => {
    if (!isValid || !cart.totalPrice) return false;

    // If ONLINE is selected, addressId must be filled
    if (placeType === "Online" && !addressId) {
      return false;
    }

    return true;
  };

  const handleAddAddress = async () => {
    if (!canAddAddress) return;

    await toast.promise(addAddress(newAddress), {
      pending: "Adding new address...",
      success: "Address added successfully! 🎉",
      error: "Failed to add address. Please try again.",
    });

    setNewAddress(initialAddress);
  };

  const onSubmit = async (data: FormValues) => {
    if (!cart._id || !cart.totalPrice) return;

    const currentAddress = addresses?.addresses?.find(
      (a) => a._id === data.addressId
    );

    await toast.promise(
      checkout({
        cartId: cart._id,
        addressId: data.addressId,
        placeType: data.placeType,
        paymentMethod: data.paymentMethod,
        city: currentAddress?.city,
        governorate: currentAddress?.governorate,
      }),
      {
        pending: "Processing your order...",
        success: "Order placed successfully! 🎉",
        error: "Failed to place order. Please try again.",
      }
    );
  };

  return (
    <PageLayout banner={MenuImages.banner} caption="order">
      <form
        onSubmit={(e) => e.preventDefault()}
        method="GET"
        className="p-4 px-8 maxh-dvh h-full space-y-10 overflow-x-hidden grid grid-rows-[1fr_auto]"
      >
        <div className="">
          {/* Place Type & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
            <PlaceTypeSelector control={control} errors={errors} required />
            <PaymentMethodSelector control={control} errors={errors} required />
          </div>

          {/* Address Section (only for ONLINE) */}
          <div
            className={clsx(
              "overflow-hidden duration-500 transition-all",
              placeType === "Online"
                ? "max-h-full opacity-100"
                : "max-h-0 opacity-0"
            )}
          >
            <h2 className="mb-5">
              Choose Address{" "}
              {placeType === "Online" && (
                <span className="text-red-300">*</span>
              )}
            </h2>

            <Controller
              control={control}
              name="addressId"
              render={({ field }) => (
                <AddressSection
                  addresses={addresses?.addresses || []}
                  selectedId={field.value}
                  onSelect={field.onChange}
                  isLoading={addressesLoading}
                />
              )}
            />
            {/* Add modal new address */}
            <Modal>
              <Modal.Open opens="new-address">
                <div className="border-2 border-dashed border-border border-spacing-20 mt-5 rounded-2xl text-center p-12 hover:drop-shadow-primary/20 hover:drop-shadow-xl cursor-pointer">
                  + Add New Address
                </div>
              </Modal.Open>
              <Modal.Window name="new-address">
                <NewAddress
                  isLoading={isAddingAddress}
                  disabled={!canAddAddress || isAddingAddress}
                  setNewAddress={setNewAddress}
                  newAddress={newAddress}
                  onSubmit={handleAddAddress}
                />
              </Modal.Window>
            </Modal>
            {errors.addressId && (
              <p className="text-red-500 text-large mt-5">
                {errors.addressId.message}
              </p>
            )}
          </div>

          {/* Order Items */}
          <OrderItems products={cart.products} />
        </div>
        {/* Checkout Footer */}
        <div className="flex justify-between items-center my-5 sticky bottom-4 bg-primary/90 text-background px-8 py-4 rounded-2xl">
          <div className="flex flex-col items-start gap-2">
            <p className="uppercase text-medium opacity-70">Total Amount</p>
            <div className=" text-4xl font-bold">{cart.totalPrice}$</div>
          </div>
          <Button
            rest={{ type: "button" }}
            type="primary"
            disabled={
              !isFormValid() ||
              isCheckoutLoading ||
              (watch("placeType") === "Online" && !watch("addressId"))
            }
            onClick={handleSubmit(onSubmit)}
            className="uppercase px-8 text-large drop-shadow-lg"
          >
            Checkout
          </Button>
        </div>
      </form>
    </PageLayout>
  );
};

export default MakeOrder;

/** AddressSection Component */
const AddressSection = ({
  addresses,
  selectedId,
  onSelect,
  isLoading,
}: {
  addresses: TAddress[];
  selectedId: string;
  onSelect: (id: string) => void;
  isLoading: boolean;
}) => {
  if (isLoading) return <SmallSpinner color="white" className="mx-auto" />;

  if (!addresses.length)
    return (
      <p className="my-20 text-center text-heading-h4">
        You don't have a saved address yet.
      </p>
    );

  return (
    <ContextMenu alignment="left" size="sm">
      <ul className="space-y-5">
        {addresses.map((address) => (
          <Address
            key={address._id}
            address={address}
            variant="presentation"
            isSelected={selectedId === address._id}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </ContextMenu>
  );
};

/** OrderItems Component */
const OrderItems = ({ products }: { products: TCARTProduct[] }) => {
  if (!products.length)
    return (
      <div className="flex flex-col gap-10 items-center my-10">
        <p className="text-heading-h3">Your cart is empty</p>
        <Link to="/menu">
          <Button type="outline">Browse menu</Button>
        </Link>
      </div>
    );

  return (
    <>
      {/* <SectionHeader className="my-10">order</SectionHeader> */}
      <h2 className="my-5">order summary</h2>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell center={false} head>
              item
            </Table.Cell>
            <Table.Cell head>price</Table.Cell>
            <Table.Cell head>quantity</Table.Cell>
            <Table.Cell head>total price</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {products.map((item) => (
            <Table.Row>
              <Table.Cell>
                <div className="flex items-center gap-5">
                  <img
                    src={item.product.images[0]}
                    className="w-24 h-auto rounded-2xl"
                  />
                  <span>{item.product.name}</span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <span>{item.product.price}</span>
              </Table.Cell>
              <Table.Cell>
                <span>× {item.quantity}</span>
              </Table.Cell>
              <Table.Cell>
                <span>{item.quantity * item.product.price}</span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
