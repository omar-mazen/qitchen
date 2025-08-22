import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import SectionHeader from "@components/SectionHeader";
import Icons from "@components/Icons";
import Button from "@components/Button";
import ContextMenu from "@components/ContextMenu";
import Modal from "@components/Modal";
import ConfirmDelete from "@components/ConfirmDelete";
import EditCategory from "./EditCategory";
import AddCategory from "./AddCategory";
import { AddProduct, ProductCard } from "../Products";

import type { TCategory } from "@cTypes/categories";

import { deleteCategory as deleteCategoryAPI } from "@/services/categories";
const Category = ({ category }: { category: TCategory }) => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteCategory } = useMutation({
    mutationFn: deleteCategoryAPI,
    mutationKey: ["products"],
    onSuccess: () =>
      queryClient.setQueryData(
        ["products"],
        (oldData: { data: TCategory[] }) =>
          oldData
            ? {
                ...oldData,
                data: oldData.data.filter((cat) => cat._id != category._id),
              }
            : oldData
      ),
  });
  return (
    <>
      <section className="my-10">
        <div className="flex items-center mb-10">
          <SectionHeader className="grow">
            <h2 className="text-heading-h2">{category.name}</h2>
          </SectionHeader>
          <ContextMenu.Toggle name={category._id}>
            <div className="bg-neutral-900 p-2 rounded-full hover:bg-stone-800 transition-colors cursor-pointer">
              <Icons.Dots />
            </div>
          </ContextMenu.Toggle>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,300px)] grid-rows-[repeat(auto-fit,minmax(200px,1fr))] justify-center gap-10">
          {category.products?.length ? (
            category.products.map((product) => (
              <ProductCard product={product} />
            ))
          ) : (
            <div className="my-10 col-start-2 col-end-11">
              <p className="mb-10 text-heading-h3">
                No products found in this category. Add new products to display
                them here
              </p>
              <Button type="primary" className="mx-auto">
                add product
              </Button>
            </div>
          )}
        </div>
      </section>
      <ContextMenu.List name={category._id}>
        <Modal.Open opens={`add product to-"${category._id}`}>
          <ContextMenu.Item icon={<Icons.Add />}>add product</ContextMenu.Item>
        </Modal.Open>
        <Modal.Open opens={`edit category-${category._id}`}>
          <ContextMenu.Item icon={<Icons.Pencil />}>
            edit category
          </ContextMenu.Item>
        </Modal.Open>
        <Modal.Open opens={`delete category-${category._id}`}>
          <ContextMenu.Item icon={<Icons.Trash />}>
            delete category
          </ContextMenu.Item>
        </Modal.Open>
      </ContextMenu.List>
      <Modal.Window name={`add product to-"${category._id}`}>
        <AddProduct categoryId={category._id} />
      </Modal.Window>
      <Modal.Window name={`add category`}>
        <AddCategory />
      </Modal.Window>
      <Modal.Window name={`edit category-${category._id}`}>
        <EditCategory category={category} />
      </Modal.Window>
      <Modal.Window name={`delete category-${category._id}`}>
        <ConfirmDelete
          resourceName={category.name}
          onConfirm={async () =>
            await toast.promise(
              () => deleteCategory({ categoryId: category._id }),
              {
                pending: "Deleting category...",
                success: "Category deleted",
                error: "Failed to delete category",
              }
            )
          }
        />
      </Modal.Window>
    </>
  );
};

export default Category;
