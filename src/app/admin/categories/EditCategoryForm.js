import React, { useState } from "react";
import "./AddCategoryForm.scss";
import { editCategories } from "../Services/CategoryServices";

function EditCategoryForm({ onClose, item, onReload }) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    if (!description.trim()) {
      alert("Vui lòng nhập mô tả");
      return;
    }

    const updatedItem = {
      ...item,
      name,
      description,
    };

    try {
      const result = await editCategories(item.id, updatedItem);
      alert(result.message || "Cập nhật thành công");
      onReload(Date.now());
      onClose();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi cập nhật");
    }
  };


  return (
    <div className="overlay">
      <div className="form-container">
        <h2 className="form-title">Sửa danh mục</h2>

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
          />
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

export default EditCategoryForm;