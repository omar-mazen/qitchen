import { useMutation, useQueryClient } from "@tanstack/react-query";

import SectionHeader from "@components/SectionHeader";
import ProductForm from "./ProductForm";

import { addProduct as addProductAPI } from "@services/product";

import type { TCategory } from "@cTypes/categories";

import DefaultImage from "@images/default-image.jpg";

const AddProduct = ({
  onCloseModal,
  categoryId,
}: {
  onCloseModal?: () => void;
  categoryId: string;
}) => {
  const queryClient = useQueryClient();
  const { mutateAsync: addProduct, isPending: isLoading } = useMutation({
    mutationFn: addProductAPI,
    mutationKey: ["products"],
    onSuccess: (newData) =>
      queryClient.setQueryData(
        ["products"],
        (oldData?: { data: TCategory[] }) =>
          oldData
            ? {
                ...oldData,
                data: oldData.data.map((cat) =>
                  cat._id === categoryId
                    ? { ...cat, products: [...cat.products, newData?.product] }
                    : cat
                ),
              }
            : oldData
      ),
  });
  return (
    <div>
      <SectionHeader className="my-10">
        <h2>Add item</h2>
      </SectionHeader>
      <ProductForm
        isLoading={isLoading}
        product={{
          type: "add",
          categoryId: categoryId,
          description: "",
          image: { file: null, url: DefaultImage },
          ingredients: [],
          name: "",
          price: "",
        }}
        onCloseModal={onCloseModal}
        onSubmit={async (values) => {
          await addProduct({
            categoryId: values.type == "add" ? values.categoryId! : "",
            name: values.name,
            description: values.description,
            ingredients: values.ingredients,
            price: values.price,
            productImage: values.image.file!,
          });
        }}
      />
    </div>
  );
};

export default AddProduct;
