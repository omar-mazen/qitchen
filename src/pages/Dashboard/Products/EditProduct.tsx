import Button from "@/components/Button";
import DotsLoader from "@/components/DotsLoader";
import Icons from "@/components/Icons";
import Input from "@/components/Input";
import SectionHeader from "@/components/SectionHeader";
import { regex } from "@/constants/regex";
import { updateProduct as updateProductAPI } from "@/services/product";
import type { GetCategoriesResult, TCategory } from "@/types/categories";
import type { TProduct, UpdateProductResult } from "@/types/product";
import { handleInput } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState, type FormEvent } from "react";
import { toast } from "react-toastify";

const EditProduct = ({
  product,
  onCloseModal,
}: {
  product: TProduct;
  onCloseModal?: () => void;
}) => {
  const [image, setImage] = useState<{ file: null | File; url: string }>({
    file: null,
    url: product.images[0],
  });
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price.toString());
  const [ingredients, setIngredients] = useState(
    product.ingredients.join(", ")
  );
  const [error, setError] = useState({
    name: "",
    description: "",
    price: "",
    ingredients: "",
  });
  const errMessage = useMemo(
    () => Object.values(error).filter((err) => !!err)[0],
    [error]
  );
  const queryClient = useQueryClient();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useMutation({
    mutationKey: ["products"],
    mutationFn: updateProductAPI,
    onSuccess: (newData: UpdateProductResult) => {
      queryClient.setQueryData(["products"], (oldData: GetCategoriesResult) => {
        if (!oldData.data) return oldData;
        return {
          ...oldData,
          data: oldData?.data.map((cat: TCategory) => ({
            ...cat,
            products: cat.products.map((oldProduct: TProduct) =>
              oldProduct._id === newData?.product?._id
                ? newData?.product
                : oldProduct
            ),
          })),
        };
      });
    },
  });
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (errMessage) return;
      await toast.promise(
        updateProduct({
          productId: product._id,
          name,
          price,
          ingredients: ingredients.split(",").map((ing) => ing.trim()),
          description,
        }),
        {
          pending: "Updating product...",
          success: "Product updated",
          error: "Failed to update product",
        }
      );
      onCloseModal?.();
    },
    [
      price,
      name,
      description,
      ingredients,
      errMessage,
      onCloseModal,
      product,
      updateProduct,
    ]
  );
  return (
    <>
      <SectionHeader className="my-10">
        <h2>Edit product</h2>
      </SectionHeader>
      <div className="group relative w-[150px] h-[100px] mx-auto my-10 rounded-2xl overflow-hidden cursor-pointer after:transition-colors after:absolute hover:after:bg-background/70 after:w-full after:h-full after:top-0 after:left-0 ">
        <input
          title=""
          type="file"
          className="absolute top-0 left-0 !z-100 fill cursor-pointer"
          onChange={(e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            const file = files[0];
            setImage({
              file,
              url: URL.createObjectURL(file),
            });
          }}
        />
        <div className=" opacity-0 group-hover:opacity-100 z-10 transition-opacity absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-5">
          <Icons.Instagram />
          <p className=" text-medium text-nowrap">update image</p>
        </div>
        <figure className="absolute top-0 left-0">
          <img
            src={image.url}
            alt={`Image of ${product.name}`}
            className=" w-full !h-full object-cover"
          />
        </figure>
      </div>
      <form className="space-y-10" onSubmit={handleSubmit}>
        <Input
          placeholder="name"
          value={name}
          disabled={isUpdating}
          setValue={(value) =>
            handleInput({
              key: "name",
              value,
              setValue: setName,
              regex: regex.title,
              setError,
            })
          }
        />
        <Input
          placeholder="description"
          multiple={true}
          disabled={isUpdating}
          value={description}
          setValue={(value) =>
            handleInput({
              key: "description",
              value,
              setValue: setDescription,
              regex: regex.description,
              setError,
            })
          }
        />
        <Input
          placeholder="price"
          type="number"
          disabled={isUpdating}
          value={price.toString()}
          setValue={setPrice}
        />
        <div className="relative">
          <span
            className=" absolute top-1/2 right-4 -translate-y-1/2 cursor-help rounded-full border border-border w-10 h-10 text-center bg-background hover:bg-background-muted transition-colors"
            title="add ingredients separated by , "
          >
            ?
          </span>
          <Input
            placeholder="ingredients"
            value={ingredients}
            setValue={setIngredients}
            disabled={isUpdating}
          />
        </div>
        <div className="flex items-center gap-5 ">
          <p className=" text-red-600">{errMessage}</p>
          <Button
            type="primary"
            className="ml-auto"
            disabled={!!errMessage || isUpdating}
          >
            Submit {isUpdating && <DotsLoader />}
          </Button>
        </div>
      </form>
    </>
  );
};

export default EditProduct;
