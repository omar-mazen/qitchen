import { useQuery } from "@tanstack/react-query";

import Loader from "@components/Loader";
import Error from "@components/Error";
import Button from "@components/Button";
import Modal from "@components/Modal";
import Category from "./Category";

import { getCategories } from "@services/categories";

const Categories = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getCategories({ page: 1, pageSize: 10 }),
    staleTime: Infinity,
  });
  if (isLoading) return <Loader />;
  if (data?.error) return <Error message={data.error} />;
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-10">
        <h1 className=" text-heading-h2">Menu Managment</h1>
        <Modal.Open opens="add category">
          <Button type="outline">add new category</Button>
        </Modal.Open>
      </div>

      <div className=" rounded-2xl px-4 py-5 bg-stone-300/5">
        {data?.data?.length ? (
          data?.data?.map((category) => <Category category={category} />)
        ) : (
          <div className="h-full w-full flex gap-10 flex-col items-center justify-center">
            <p className="text-center text-heading-h3">
              There are no categories yet. Add a category to get started.
            </p>
            <Button type="primary">add category</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
