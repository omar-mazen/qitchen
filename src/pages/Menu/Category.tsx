import SectionHeader from "@components/SectionHeader";
import Categoryitem from "./CategoryItem";
import type { TCategory } from "@cTypes/categories";

const Category = ({ category }: { category: TCategory }) => {
  return (
    <section className=" px-24 py-14" id={category.name}>
      <SectionHeader>
        <h2 className=" text-heading-h2 text-center my-12">{category?.name}</h2>
      </SectionHeader>
      <ul className="space-y-8">
        {category.products.map((item) => (
          <Categoryitem key={item.name} {...item} />
        ))}
      </ul>
    </section>
  );
};
export default Category;
