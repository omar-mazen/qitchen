import { useQuery } from "@tanstack/react-query";

import PageLayout from "@components/PageLayout";
import Error from "@components/Error";
import MenuLabels from "./MenuLabels";
import Category from "./Category";

import type { GetCategoriesResult } from "@cTypes/categories";

import { getCategories } from "@services/categories";
import { MenuBanner } from "@/constants/images";

const Menu = () => {
  const { isLoading, isError, data } = useQuery<GetCategoriesResult>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    suspense: true,
    staleTime: Infinity,
  });

  if (isError) return <Error message={data?.error} />;

  const categories = data?.data?.filter((cat) => cat.products.length > 0) || [];

  return (
    <PageLayout banner={MenuBanner} caption="Menu">
      <div className="border border-border rounded-2xl overflow-y-scroll h-full">
        {categories.length > 0 ? (
          <>
            <MenuLabels
              labels={categories
                .filter((cat) => cat.products.length > 0)
                .map((cat) => cat.name)}
            />
            {categories?.map((category) =>
              category.products.length > 0 ? (
                <Category category={category} key={category._id} />
              ) : null
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full px-8">
            <p className=" text-heading-h3 text-center">
              The menu is not available at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Menu;
