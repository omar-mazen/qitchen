import SectionHeader from "@components/SectionHeader";
import Icons from "@components/Icons";
import Button from "@components/Button";
import ProductCard from "./ProductCard";

import type { TCategory } from "@cTypes/categories";
const Category = ({ category }: { category: TCategory }) => {
  return (
    <section>
      <div className="flex items-center">
        <SectionHeader className="my-20 grow">
          <h2 className="text-heading-h2">{category.name}</h2>
        </SectionHeader>
        <Icons.Dots />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,300px)] justify-center gap-10">
        {category.products.length ? (
          category.products.map((product) => <ProductCard product={product} />)
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
  );
};

export default Category;
