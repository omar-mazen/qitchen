import SectionHeader from "@components/SectionHeader";
import type { TItem } from "@cTypes/menu";
import Categoryitem from "./CategoryItem";

const Category = ({
  categoryName,
  category,
}: {
  categoryName: string;
  category: TItem[];
}) => {
  return (
    <section className=" px-24">
      <SectionHeader>
        <h2 className=" text-heading-h2 text-center my-12">{categoryName}</h2>
      </SectionHeader>
      <ul className="space-y-8">
        {category.map((item) => (
          <Categoryitem key={item.name} {...item} />
        ))}
      </ul>
    </section>
  );
};
export default Category;
