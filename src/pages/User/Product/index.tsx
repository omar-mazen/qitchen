// ==============================
// React
// ==============================
import { memo, useEffect, useMemo, useState } from "react";

// ==============================
// Router & Data
// ==============================
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

// ==============================
// App Hooks & Services
// ==============================
import { useCart } from "@/context/CartContext";
import { getProductById } from "@services/product";

// ==============================
// UI Components
// ==============================
import PageLayout from "@components/PageLayout";
import Button from "@components/Button";
import Error from "@components/Error";
import DotsLoader from "@components/DotsLoader";

// ==============================
// Types & Constants
// ==============================
import type { GetProductByIdResult } from "@cTypes/product";
import { MenuImages } from "@/constants/images";

// ==============================
// Utils
// ==============================
import clsx from "clsx";
import QuantitySelector from "@/components/QuantitySelector";

const Product = () => {
  const { id } = useParams();
  const {
    addToCart,
    isLoading: cartIsLoading,
    cart,
    updateCartProductQuantity,
  } = useCart();

  // Product in cart (memoized lookup)
  const productInCart = useMemo(
    () => cart.products.find((el) => el.product._id === id),
    [cart.products, id]
  );

  const inCartQuantity = productInCart?.quantity ?? 0;
  const inCart = inCartQuantity > 0;

  const [quantity, setQuantity] = useState<number>(inCartQuantity || 1);

  useEffect(() => {
    if (inCartQuantity) setQuantity(inCartQuantity);
  }, [inCartQuantity]);

  const { data } = useQuery<GetProductByIdResult>({
    queryKey: ["product", id],
    queryFn: () => getProductById({ id: id ?? "" }),
    enabled: !!id,
    staleTime: Infinity,
  });

  if (data?.error) return <Error message={data.error} />;
  if (!data?.product)
    return <Error message={`No Product found with ID #${id}`} />;

  const { name, ingredients, images, isAvailable, description, price } =
    data.product;

  // Derived UI state
  const isSameQuantity = inCartQuantity === quantity;
  const isUpdating = inCart && !isSameQuantity;
  const isDisabled = !isAvailable || cartIsLoading || isSameQuantity;
  console.log(quantity);
  const handleCartAction = () => {
    if (!data.product) return;

    if (inCart) {
      updateCartProductQuantity({
        action: quantity < inCartQuantity ? "decrease" : "increase",
        product: data.product,
        quantity,
      });
    } else {
      addToCart({ product: data.product, quantity });
    }
  };

  return (
    <PageLayout banner={MenuImages.banner} caption="Menu">
      <div className="flex flex-col md:flex-row gap-10 p-12 sm:p-24">
        <figure className="w-[150px] h-[100px] shrink-0">
          <img
            src={images[0]}
            alt={`Image of ${name}`}
            className="rounded-2xl w-full h-full object-contain"
          />
        </figure>

        <div className="flex flex-col gap-8">
          <h2 className="text-heading-h2">{name}</h2>

          <p>
            <strong>Description:</strong> {description}
          </p>

          <p>
            <strong>Ingredients:</strong> {ingredients.join(", ")}
          </p>

          <div className="grid grid-cols-[auto_1fr] gap-5 items-center">
            <span className="font-bold">Quantity:</span>
            <QuantitySelector
              centered={false}
              quantity={quantity}
              isAvailable={isAvailable}
              isAccelerates
              onCommit={(q) => setQuantity(q)}
            />
          </div>

          <p>
            <strong>Price:</strong> {price}$
          </p>

          <PriceSummary
            quantity={quantity}
            price={price}
            inCart={inCart}
            inCartQuantity={inCartQuantity}
          />

          <AddToCartButton
            isAvailable={isAvailable}
            isSameQuantity={isSameQuantity}
            isUpdating={isUpdating}
            quantity={quantity}
            isLoading={cartIsLoading}
            disabled={isDisabled}
            onClick={handleCartAction}
          />
        </div>
      </div>
    </PageLayout>
  );
};

// ==============================
// Price Summary
// ==============================
interface PriceSummaryProps {
  quantity: number;
  price: number;
  inCart: boolean;
  inCartQuantity: number;
}

const PriceSummary = memo(
  ({ quantity, price, inCart, inCartQuantity }: PriceSummaryProps) => {
    const totalPrice = inCart ? inCartQuantity * price : price * quantity;

    return (
      <div
        className={clsx(
          "overflow-hidden transition-all duration-500",
          quantity > 1 || inCart ? "my-0" : "-my-6"
        )}
      >
        <p
          className={clsx(
            "transition-all duration-500",
            quantity > 1 || inCart
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full"
          )}
        >
          <span className="font-bold">Total price: </span>
          <span>{totalPrice}$</span>
        </p>
      </div>
    );
  }
);

// ==============================
// Add To Cart Button
// ==============================
interface AddToCartButtonProps {
  isAvailable: boolean;
  isSameQuantity: boolean;
  isUpdating: boolean;
  quantity: number;
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
}

const AddToCartButton = memo(
  ({
    isAvailable,
    isSameQuantity,
    isUpdating,
    quantity,
    isLoading,
    disabled,
    onClick,
  }: AddToCartButtonProps) => (
    <Button type="primary" disabled={disabled} onClick={onClick}>
      {isLoading ? (
        <>
          Adding to cart
          <DotsLoader />
        </>
      ) : !isAvailable ? (
        "Out of stock"
      ) : isSameQuantity ? (
        "Already added"
      ) : isUpdating ? (
        `Update cart to ${quantity}`
      ) : quantity > 1 ? (
        `Add ${quantity} items to cart`
      ) : (
        "Add to cart"
      )}
    </Button>
  )
);

export default Product;
