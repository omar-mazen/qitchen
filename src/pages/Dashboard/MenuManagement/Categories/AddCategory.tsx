import { useMutation, useQueryClient } from "@tanstack/react-query";

import SectionHeader from "@components/SectionHeader";
import CategoryForm from "./CategoryForm";

import { addCategory as addCategoryAPI } from "@services/categories";

import type { TCategory } from "@cTypes/categories";
const AddCategory = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: addCategory, isPending: isAdding } = useMutation({
    mutationKey: ["products"],
    mutationFn: addCategoryAPI,
    onSuccess: (newData) =>
      queryClient.setQueryData(
        ["products"],
        (oldData: { data: TCategory[] }) => {
          console.log(newData, oldData);
          if (!oldData) return { data: [newData.category] };
          return {
            data: [...oldData.data, newData.category],
          };
        }
      ),
  });
  return (
    <CategoryForm
      category={{ name: "", description: "", type: "add" }}
      onSubmit={(values) =>
        addCategory({
          name: values.name,
          description: values.description,
        })
      }
      isLoading={isAdding}
    >
      <SectionHeader>
        <h2 className="my-10">Add Category</h2>
      </SectionHeader>
    </CategoryForm>
  );
};

export default AddCategory;
