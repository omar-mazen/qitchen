import { useQuery } from "@tanstack/react-query";

import Loader from "@components/Loader";
import PageLayout from "@components/PageLayout";
import MenuLabels from "./MenuLabels";
import Category from "./Category";

import type { GetCategoriesResult } from "@cTypes/categories";

import banner from "@images/menu/menu.png";

import { getCategories } from "@services/categories";

const Menu = () => {
  const { isLoading, isError, data } = useQuery<GetCategoriesResult>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  if (isError) return <p>Error ...</p>;
  if (isLoading) return <Loader />;

  const categories = data?.data ?? [];

  if (categories.length === 0) return <p>No categories found.</p>;

  return (
    <PageLayout banner={banner} caption="Menu">
      <div className="border border-border rounded-2xl overflow-y-scroll h-full">
        <MenuLabels
          labels={categories
            .filter((cat) => cat.products.length > 0)
            .map((cat) => cat.name)}
        />
        {categories.map((category) =>
          category.products.length > 0 ? (
            <Category category={category} key={category._id} />
          ) : null
        )}
      </div>
    </PageLayout>
  );
};

export default Menu;
