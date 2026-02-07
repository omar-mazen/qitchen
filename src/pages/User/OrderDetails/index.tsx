import { useEffect, useState } from "react";
import clsx from "clsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  TOrderStatusColors,
  TPaymentStatusColors,
  type TOrderStatus,
  type TPaymentMethod,
  type TPlaceType,
} from "@cTypes/orders";

import CartProduct from "@pages/User/Cart/CartProduct";
import Error from "@components/Error";
import OrderTable from "./OrderTable";
import SelectOption from "@/components/SelectOptions";

import { OrderStatus } from "@constants/order";

import { useAuth } from "@/hooks/useAuth";

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
import ContextMenu from "@/components/ContextMenu";
import PlaceTypeSelector from "@/components/PlaceTypeSelector";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";

// Yup Schema for reorder form
const reorderSchema = yup.object({
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

type ReorderFormValues = {
  placeType: TPlaceType;
  paymentMethod: TPaymentMethod;
  addressId: string;
};

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

  const { data: addresses, isLoading: addressesLoading } = useQuery({
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

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    watch,
  } = useForm<ReorderFormValues>({
    mode: "all",
    resolver: yupResolver(reorderSchema),
    defaultValues: {
      placeType: undefined,
      paymentMethod: undefined,
      addressId: "",
    },
  });

  const placeType = watch("placeType");
  const addressId = watch("addressId");

  // Clear addressId when switching away from ONLINE
  useEffect(() => {
    if (placeType !== "Online") {
      setValue("addressId", "");
    }
    trigger("addressId");
  }, [placeType, setValue, trigger]);

  // Set default address when addresses load
  useEffect(() => {
    if (addresses?.addresses?.length && placeType === "Online" && !addressId) {
      // Optionally auto-select the original order's address or first address
      const originalAddressId = data?.order?.address?._id;
      const addressExists = addresses.addresses.find(
        (a) => a._id === originalAddressId
      );
      if (addressExists) {
        setValue("addressId", originalAddressId);
      }
    }
  }, [addresses, placeType, addressId, setValue, data?.order?.address]);

  // Check if form is valid for submission
  const isFormValid = () => {
    if (!isValid) return false;
    if (placeType === "Online" && !addressId) {
      return false;
    }
    return true;
  };

  const onReorderSubmit = async (formData: ReorderFormValues) => {
    if (!data?.order) return;

    const items = data.order.products.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
    }));

    const currentAddress = addresses?.addresses?.find(
      (a) => a._id === formData.addressId
    );

    const baseProps = {
      addressId: formData.addressId || addresses?.addresses[0]._id!,
      paymentMethod: formData.paymentMethod,
      items,
    };

    const reorderPromise =
      formData.placeType === "Online"
        ? reorder({
            ...baseProps,
            placeType: "Online",
            city: currentAddress!.city,
            governorate: currentAddress!.governorate,
          })
        : reorder({
            ...baseProps,
            placeType: formData.placeType, // "In-place" | "Takeaway"
          });

    await toast.promise(reorderPromise, {
      pending: "Processing your reorder...",
      success: "Your reorder was placed successfully!",
      error: "Reorder failed. Please try again.",
    });
  };

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
        <div className="space-y-10 mb-10 bg-background-muted border border-border rounded-2xl p-8">
          <div className="flex items-start justify-between gap-5 border-b border-border pb-8">
            <div className="flex flex-col gap-2 flex-1">
              <span className="text-primary-muted">ORDER ID</span>
              <span className="font-normal">#{data?.order?._id}</span>
            </div>
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
                <span
                  className={`${TOrderStatusColors[data?.order?.orderStatus]} rounded-3xl px-4 py-2 text-center inline-block ml-5 font-normal text-large font-medium`}
                >
                  <span className=" font-extrabold uppercase">order :</span>
                  {data?.order?.orderStatus}
                </span>
              </p>
            )}
            <p>
              <span
                className={`${TPaymentStatusColors[data?.order?.paymentStatus]} rounded-3xl px-4 py-2 text-center inline-block ml-5 font-normal text-large font-medium`}
              >
                <span className=" font-extrabold uppercase">payment : </span>
                {data?.order?.paymentStatus}
              </span>
            </p>
          </div>
          {user?.role == "Admin" && (
            <div className="flex justify-between gap-5 items-center border-b border-border pb-8">
              <p>
                <span className=" text-primary-muted font-normal capitalize">
                  customer name:{" "}
                </span>
                <span className=" font-normal capitalize">
                  {data?.order?.buyer.name}
                </span>
              </p>
              <p>
                <span className=" text-primary-muted font-normal capitalize">
                  customer phone:{" "}
                </span>
                <span className=" font-normal capitalize">
                  {" "}
                  {data?.order?.buyer.phoneNumber}
                </span>
              </p>
            </div>
          )}
          <div className="flex items-center gap-12">
            <div className=" space-y-3 flex-1">
              <p className="space-y-3">
                <span className=" capitalize font-normal text-primary-muted flex flex-row items-center gap-1">
                  <Icons.MapIcon className="inline-block" />
                  Delivery Address:{" "}
                </span>
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
              <div className="flex items-center gap-5">
                <p>
                  <span className=" text-primary-muted font-normal capitalize">
                    Building :{" "}
                  </span>
                  <span className=" font-normal capitalize">
                    {data?.order?.address?.buildingNumber}
                  </span>
                </p>
                <p>
                  <span className=" text-primary-muted font-normal capitalize">
                    flat :{" "}
                  </span>
                  <span className=" font-normal capitalize">
                    {data?.order?.address?.flatNumber}
                  </span>
                </p>
              </div>
            </div>
            <p className="flex gap-2 text-primary-muted">
              <Icons.Money />
              {data?.order?.paymentMethod}
            </p>
            <p className="flex gap-2 text-primary-muted">
              <Icons.Store />
              {data?.order?.placeType}
            </p>
            {data?.order?.placeType == "In-Place" && (
              <div className="flex items-center gap-2 text-primary-muted">
                <Icons.Table className="size-6" /> table{" "}
                {data.order?.table?.number}
              </div>
            )}
          </div>
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
          <div className=" flex flex-row-reverse gap-5 w-full justify-start mt-8">
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

                await toast.promise(addProductsToCart(items), {
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
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6 mt-5">
          {/* Place Type & Payment Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <PlaceTypeSelector control={control} errors={errors} required />
            <PaymentMethodSelector control={control} errors={errors} required />
          </div>

          {/* Address Selection (only for ONLINE) */}
          <div
            className={clsx(
              "overflow-hidden duration-500 transition-all",
              placeType === "Online"
                ? "max-h-full opacity-100"
                : "max-h-0 opacity-0"
            )}
          >
            <h3 className="mb-5">
              Choose Address{" "}
              {placeType === "Online" && (
                <span className="text-red-300">*</span>
              )}
            </h3>

            <Controller
              control={control}
              name="addressId"
              render={({ field }) => (
                <ContextMenu alignment="left" size="sm">
                  <ul className="space-y-5">
                    {addressesLoading && (
                      <SmallSpinner color="white" className="mx-auto" />
                    )}
                    {!addressesLoading &&
                    (addresses?.addresses || []).length > 0
                      ? (addresses?.addresses || []).map((address) => (
                          <Address
                            key={address._id}
                            address={address}
                            isSelected={field.value === address._id}
                            onSelect={field.onChange}
                            variant="presentation"
                          />
                        ))
                      : !addressesLoading && (
                          <div>
                            <p className="text-heading-h4 my-20 text-center">
                              You don't have a saved address yet. Please add one
                              to continue with your order.
                            </p>
                          </div>
                        )}
                  </ul>
                </ContextMenu>
              )}
            />
            {errors.addressId && (
              <p className="text-red-500 text-large mt-5">
                {errors.addressId.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="primary"
            className="flex items-center justify-center gap-2 mx-auto mt-5 w-full"
            disabled={!isFormValid() || reorderLoading}
            onClick={handleSubmit(onReorderSubmit)}
            rest={{ type: "button" }}
          >
            {!reorderLoading ? (
              <>
                <Icons.Reload />
                <span>Reorder Now</span>
              </>
            ) : (
              <span>
                Processing <DotsLoader />
              </span>
            )}
          </Button>
        </form>
      </Modal.Window>
    </Modal>
  );
};

export default OrderDetails;
