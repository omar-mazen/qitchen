import React, { useCallback, useMemo, useState, type FormEvent } from "react";
import { toast } from "react-toastify";

import Button from "@components/Button";
import DotsLoader from "@components/DotsLoader";
import Icons from "@components/Icons";
import Input from "@components/Input";

import { regex } from "@constants/regex";

import { handleInput } from "@/utils";
export type Image = {
  file: File | null;
  url: string | null;
};
export type ProductFormInputBase = {
  name: string;
  description: string;
  ingredients: string[];
  price: string;
  image: Image;
};
type ProductFormInputEdit = ProductFormInputBase & {
  type: "edit";
  productId?: string;
};
type ProductFormInputAdd = ProductFormInputBase & {
  type: "add";
  categoryId?: string;
};
type ProductFormInput = ProductFormInputEdit | ProductFormInputAdd;

type ProductFormProps = {
  product: ProductFormInput;
  isLoading: boolean;
  onSubmit: (values: ProductFormInput) => Promise<unknown>; // <-- ✅ generic
  onCloseModal?: () => void;
  children?: React.ReactNode;
};
const ProductForm = ({
  product,
  isLoading,
  onSubmit,
  onCloseModal,
  children,
}: ProductFormProps) => {
  const [image, setImage] = useState<Image>({
    file: null,
    url: product.image.url,
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
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (errMessage) return;
      await toast.promise(
        () =>
          onSubmit({
            type: product.type,
            categoryId: product.type == "add" ? product.categoryId! : null!,
            productId: product.type == "edit" ? product.productId! : null!,
            name,
            price: price.toString(),
            ingredients: ingredients.split(",").map((ing) => ing.trim()),
            description,
            image: image,
          }),
        {
          pending: `${product.type == "edit" ? "Updating" : "Adding"} product...`,
          success: `Product ${product.type == "add" ? "updating" : "adding"}`,
          error: `Failed to ${product.type == "edit" ? "update" : "add"} product`,
        }
      );
      onCloseModal?.();
    },
    [
      image,
      price,
      name,
      description,
      ingredients,
      errMessage,
      onCloseModal,
      product,
      onSubmit,
    ]
  );
  return (
    <>
      {children}
      <form
        className="space-y-10"
        onSubmit={async (e) => {
          await handleSubmit(e);
          onCloseModal?.();
        }}
      >
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
              src={image.url || ""}
              alt={`Image of ${product.name}`}
              className=" w-full !h-full object-cover"
            />
          </figure>
        </div>
        <Input
          placeholder="name"
          value={name}
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center gap-5 ">
          <p className=" text-red-600">{errMessage}</p>
          <Button
            type="primary"
            className="ml-auto"
            disabled={!!errMessage || isLoading}
          >
            Submit {isLoading && <DotsLoader />}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProductForm;
