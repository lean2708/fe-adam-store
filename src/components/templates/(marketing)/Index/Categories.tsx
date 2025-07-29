import { TCategory } from "@/types";
import CategoryItem from "./Category/CategoryItem";

export default function Categories({
  categories,
}: {
  categories: TCategory[];
}) {
  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 px-8">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            title={category.title}
            imageSrc={category.image}
          />
        ))}
      </div>
    </section>
  );
}
