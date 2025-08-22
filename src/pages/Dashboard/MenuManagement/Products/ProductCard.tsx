import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import ConfirmDelete from "@components/ConfirmDelete";
import ContextMenu from "@components/ContextMenu";
import Icons from "@components/Icons";
import Modal from "@components/Modal";
import Toggler from "@components/Toggler";
import EditProduct from "./EditProduct";

import {
  deleteProduct as deleteProductAPI,
  toggleProductAvailability as toggleProductAvailabilityAPI,
} from "@services/product";

import type { TProduct } from "@cTypes/product";
import type { GetCategoriesResult } from "@cTypes/categories";

const ProductCard = ({ product }: { product: TProduct }) => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteProduct } = useMutation({
    mutationKey: ["products"],
    mutationFn: deleteProductAPI,
    onSuccess: () => {
      queryClient.setQueryData(["products"], (oldData: GetCategoriesResult) => {
        if (!oldData.data) return oldData;
        return {
          ...oldData,
          data: oldData?.data.map((cat) => ({
            ...cat,
            products: cat.products.filter(
              (catProduct) => catProduct._id != product._id
            ),
          })),
        };
      });
    },
  });
  const { mutateAsync: toggleProductAvailability, isPending: isLoading } =
    useMutation({
      mutationKey: ["products"],
      mutationFn: toggleProductAvailabilityAPI,
      onSuccess: () => {
        queryClient.setQueryData(
          ["products"],
          (oldData: GetCategoriesResult) => {
            if (!oldData?.data) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((cat) => ({
                ...cat,
                products: cat.products.map((oldProduct) =>
                  oldProduct._id === product?._id
                    ? { ...oldProduct, isAvailable: !oldProduct.isAvailable }
                    : oldProduct
                ),
              })),
            };
          }
        );
      },
    });
  return (
    <>
      <div className="grid grid-cols-1 grid-rows-[200px_1fr] items-stretch border border-border rounded-2xl overflow-hidden relative">
        <figure className="relative w-full max-h-[200px] overflow-clip border-b border-border">
          <div className=" absolute right-4 top-4 ">
            <ContextMenu.Toggle name={product._id}>
              <div className="bg-neutral-900 p-2 rounded-full hover:bg-stone-800 transition-colors cursor-pointer">
                <Icons.Dots />
              </div>
            </ContextMenu.Toggle>
          </div>
          <img
            src={product.images[0]}
            alt={`Image of ${product.name}`}
            className="rounded-t-2xl w-full max-h-[200px] !h-[200px] object-cover overflow-hidden"
          />
        </figure>
        <div className="p-6 space-y-5 h-full flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-heading-h3">{product.name}</p>
            <p className="grow text-right">{product.price}$</p>
          </div>
          <p className="font-normal font-thin text-large">
            <span className="font-medium">Description: </span>
            <span className="text-primary/90">{product.description}</span>
          </p>
          <p className="font-normal font-thin text-large">
            <span className="font-medium">Ingredients: </span>
            <span className="text-primary/80">
              {product.ingredients.join(", ")}
            </span>
          </p>
          <div className="flex items-end justify-between grow">
            <p className="font-normal font-thin text-xlarge text-primary/80">
              Availability
            </p>
            <Toggler
              disabled={isLoading}
              checked={product.isAvailable}
              toggle={() =>
                toggleProductAvailability({ productId: product?._id })
              }
            />
          </div>
        </div>
      </div>
      <ContextMenu.List name={product._id}>
        <Modal.Open opens={`edit-${product._id}`}>
          <ContextMenu.Item icon={<Icons.Pencil />}>edit</ContextMenu.Item>
        </Modal.Open>
        <Modal.Open opens="delete">
          <ContextMenu.Item icon={<Icons.Trash />}>delete</ContextMenu.Item>
        </Modal.Open>
      </ContextMenu.List>
      <Modal.Window name={`edit-${product._id}`}>
        <EditProduct product={product} />
      </Modal.Window>
      <Modal.Window name="delete">
        <ConfirmDelete
          resourceName={product.name}
          onConfirm={async () => {
            await toast.promise(
              () => deleteProduct({ productId: product._id }),
              {
                pending: "Deleting product...",
                success: "Product deleted",
                error: "Failed to delete product",
              }
            );
          }}
        />
      </Modal.Window>
    </>
  );
};

export default ProductCard;
