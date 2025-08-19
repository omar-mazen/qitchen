import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import Loader from "@components/Loader";
import PageLayout from "@components/PageLayout";
import Button from "@components/Button";
import Badge from "@components/Badge";
import Error from "@components/Error";

import type { GetProductByIdResult } from "@cTypes/product";

import { getProductById } from "@services/product";

import banner from "@images/menu/menu.png";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import DotsLoader from "@/components/DotsLoader";

const Product = () => {
  const { addToCart, isLoading: cartIsLoading } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const { id } = useParams();
  const { data, isLoading } = useQuery<GetProductByIdResult>({
    queryKey: ["product", id],
    queryFn: () => getProductById({ id: id ?? "" }),
    enabled: !!id,
    staleTime: Infinity,
  });

  if (isLoading) return <Loader />;
  if (data?.error) return <Error message={data.error} />;
  if (!data?.product)
    return <Error message={`No Product was found with the ID #${id}.`} />;

  const { name, ingredients, images, isAvailable, description, price } =
    data.product;

  return (
    <PageLayout banner={banner} caption="Menu">
      <div className="w-full flex gap-10 p-12 sm:p-24">
        <figure className="w-[150px] h-[100px] overflow-hidden shrink-0">
          <img
            src={images[0]}
            alt={`Image of ${name}`}
            className="rounded-2xl w-full !h-full object-contain"
          />
        </figure>
        <div className="flex flex-col gap-10">
          <h2 className=" text-heading-h2">{name}</h2>
          <p className="">
            <span className="font-bold">description: </span>
            <span className="font-normal font-thin text-xlarge tracking-wide">
              {description}
            </span>
          </p>
          <p className="">
            <span className=" font-bold">ingredients: </span>
            <span className="font-normal capitalize text-xlarge">
              {ingredients.join(", ")}
            </span>
          </p>
          <div className="grid grid-cols-[auto_1fr] gap-5 items-center">
            <span className="font-bold">quantity:</span>
            <span className="flex flex-wrap gap-y-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Badge
                  isActive={i + 1 == quantity}
                  onClick={() => setQuantity(i + 1)}
                >
                  {i + 1}
                </Badge>
              ))}
            </span>
          </div>
          <p>
            <span className=" font-bold">price: </span>
            <span className="font-normal">{price}$</span>
          </p>
          <Button
            type="primary"
            disabled={!isAvailable || cartIsLoading}
            onClick={() => {
              if (data.product) addToCart({ product: data.product, quantity });
            }}
          >
            {cartIsLoading ? (
              <>
                adding
                <DotsLoader />
              </>
            ) : isAvailable ? (
              "Add to cart"
            ) : (
              "this product not avilable"
            )}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Product;
