import React, { useState } from "react";
import "./AddCategoryForm.scss";
import { createCategories } from "../Services/CategoryServices";

function AddCategoryForm({ onClose, onReload }) {
  // State để lưu tên danh mục và mô tả
  const [name, setName] = useState(""); // name - tên danh mục
  const [description, setDescription] = useState(""); // description - mô tả

  // Hàm xử lý khi bấm nút xác nhận
  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    if (!description.trim()) {
      alert("Vui lòng nhập mô tả");
      return;
    }


    const fetchApi = async () => {
      const result = await createCategories({ name: name, description: description });
      alert(result.message)
    }; fetchApi()
    onClose()
    onReload();

    console.log("Tên danh mục:", name);
    console.log("Mô tả:", description);
  };


  return (
    <div className="overlay">
      <div className="form-container">
        <h2 className="form-title">Thêm danh mục</h2>

        <div className="form-group">
          <label className="form-label">Tên danh mục</label>
          <input
            type="text"
            placeholder="Nhập tên danh mục"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea
            placeholder="Nhập mô tả"
            rows="4"
            className="form-input textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-buttons">
          <button className="btn cancel-btn" onClick={onClose}>
            ✖ Hủy bỏ
          </button>
          <button className="btn confirm-btn" onClick={handleSubmit}>
            ✔ Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCategoryForm;