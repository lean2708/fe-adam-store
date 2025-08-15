"use client";

import { TCategory } from "@/types";
import CategoryItem from "./Category/CategoryItem";
import { getAllCategoriesAction } from "@/actions/categoryActions";
import { CategorySkeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function Categories() {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Marketing");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategoriesAction();

        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <section>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 px-8">
          {[...Array(6)].map((_, index) => (
            <CategorySkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  // Show empty state if no categories
  if (!categories.length) {
    return (
      <section>
        <div className="text-center py-8">
          <p className="text-gray-500">{t("categories.noCategories")}</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 px-8">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            title={category.name}
            imageSrc={category.imageUrl} id={""}          />
        ))}
      </div>
    </section>
  );
}
