import { useMutation, useQueryClient } from "@tanstack/react-query";

import SectionHeader from "@components/SectionHeader";
import CategoryForm from "./CategoryForm";

import { updateCategory as updateCategoryAPI } from "@/services/categories";

import type { TCategory } from "@cTypes/categories";

const EditCategory = ({
  category,
  onCloseModal,
}: {
  category: TCategory;
  onCloseModal?: () => void;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateCategory, isPending: isUpdating } = useMutation({
    mutationKey: ["products"],
    mutationFn: updateCategoryAPI,
    onSuccess: (newData) => {
      queryClient.setQueryData(
        ["products"],
        (oldData: { data: TCategory[] }) => {
          return {
            ...oldData,
            data: oldData.data?.map((cat) =>
              cat._id === category._id ? newData.category : cat
            ),
          };
        }
      );
      onCloseModal?.();
    },
  });
  return (
    <CategoryForm
      category={{
        name: category.name,
        description: category.description,
        categoryId: category._id,
        type: "edit",
      }}
      onSubmit={(values) =>
        updateCategory({
          name: values.name,
          description: values.description,
          categoryId: category._id,
        })
      }
      isLoading={isUpdating}
    >
      <SectionHeader>
        <h2 className="my-10">edit category</h2>
      </SectionHeader>
    </CategoryForm>
  );
};

export default EditCategory;
