import { useMutation, useQueryClient } from "@tanstack/react-query";

import SectionHeader from "@components/SectionHeader";
import { updateProduct as updateProductAPI } from "@services/product";
import ProductForm from "./ProductForm";

import type { GetCategoriesResult, TCategory } from "@cTypes/categories";
import type { TProduct, UpdateProductResult } from "@cTypes/product";

const EditProduct = ({
  product,
  onCloseModal,
}: {
  product: TProduct;
  onCloseModal?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useMutation({
    mutationKey: ["products"],
    mutationFn: updateProductAPI,
    onSuccess: (newData: UpdateProductResult) => {
      queryClient.setQueryData(["products"], (oldData: GetCategoriesResult) => {
        if (!oldData.data) return oldData;
        return {
          ...oldData,
          data: oldData?.data?.map((cat: TCategory) => ({
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

  return (
    <>
      <SectionHeader className="my-10">
        <h2>Edit product</h2>
      </SectionHeader>
      <ProductForm
        product={{
          type: "edit",
          productId: product._id,
          name: product.name,
          description: product.description,
          ingredients: product.ingredients,
          price: product.price.toString(),
          image: { file: null, url: product.images[0] },
        }}
        onSubmit={async (values) =>
          await updateProduct({
            productId: product._id,
            name: values.name,
            description: values.description,
            ingredients: values.ingredients,
            price: values.price,
          })
        }
        isLoading={isUpdating}
        onCloseModal={onCloseModal}
      />
    </>
  );
};

export default EditProduct;
