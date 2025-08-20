import { useQuery } from "@tanstack/react-query";

import Loader from "@components/Loader";
import Error from "@components/Error";
import Category from "./Category";

import { getCategories } from "@services/categories";
import Button from "@/components/Button";
import ContextMenu from "@/components/ContextMenu";
import Modal from "@/components/Modal";

const Products = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getCategories({ page: 1, pageSize: 10 }),
    staleTime: Infinity,
  });
  if (isLoading) return <Loader />;
  if (data?.error) return <Error message={data.error} />;
  return (
    <Modal>
      <ContextMenu>
        <div className="h-full">
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
      </ContextMenu>
    </Modal>
  );
};

export default Products;
