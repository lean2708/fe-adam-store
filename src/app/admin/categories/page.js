"use client";
import { useState } from "react";
import CategoryTable from "./CategoryTable";
import AddCategoryForm from "./AddCategoryForm";

function Categories() {

  const [showFormAdd, setShowFormAdd] = useState(false);
  const [reload, setReload] = useState(Date.now());
  return (
    <>
      <div className="category-table">
        <div className="category-table__wrapper">
          <div className="category-table__header">
            <h2 className="category-table__header-title">Danh mục</h2>
            <button className="category-table__header-btn" onClick={() => setShowFormAdd(true)}>
              <span>➕</span> Thêm danh mục
            </button>
          </div>
          {showFormAdd && <AddCategoryForm onClose={() => setShowFormAdd(false)} onReload={() => setReload(Date.now())} />}
          <CategoryTable reLoad={reload} onReload={() => setReload(Date.now())} />

        </div>
      </div>
    </>
  )
}

export default Categories;