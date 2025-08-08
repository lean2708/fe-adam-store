import { useEffect, useState } from "react";
import "./category.scss";
import Image from 'next/image';
import { deleteCategories, getCategories, reStoreCategories } from "../Services/CategoryServices";
import icon from '../assets/images/icon1.png';
import EditCategoryForm from "./EditCategoryForm";

export default function CategoryTable({reLoad, onReload}) {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [itemEdit, setItemEdit] = useState({});

  useEffect(() => {
    const fetchApi = async () => {
      const response = await getCategories(currentPage, 10);
      setCategories(response.result.items);
      setTotalPage(response.result.totalPages);
    };
    fetchApi();
  }, [currentPage, reLoad]);

  const renderPagination = () => {
    const pages = [];

    if (totalPage <= 7) {
      // Nếu tổng số trang ít, hiển thị hết
      for (let i = 0; i < totalPage; i++) {
        pages.push(
          <button
            key={i}
            className={currentPage === i ? "active" : ""}
            onClick={() => setCurrentPage(i)}
          >
            {i + 1}
          </button>
        );
      }
    } else {
      // Trang đầu
      pages.push(
        <button
          key={0}
          className={currentPage === 0 ? "active" : ""}
          onClick={() => setCurrentPage(0)}
        >
          1
        </button>
      );

      // Dấu ...
      if (currentPage > 2) {
        pages.push(<span key="start-ellipsis">. . .</span>);
      }

      // Các trang ở giữa
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPage - 2, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            className={currentPage === i ? "active" : ""}
            onClick={() => setCurrentPage(i)}
          >
            {i + 1}
          </button>
        );
      }

      // Dấu ...
      if (currentPage < totalPage - 3) {
        pages.push(<span key="end-ellipsis">. . .</span>);
      }

      // Trang cuối
      pages.push(
        <button
          key={totalPage - 1}
          className={currentPage === totalPage - 1 ? "active" : ""}
          onClick={() => setCurrentPage(totalPage - 1)}
        >
          {totalPage}
        </button>
      );
    }

    return pages;
  };


  // Toggle menu từng dòng
  const toggleMenu = (index) => {
    setOpenMenuIndex(prev => (prev === index ? null : index));
  };

  const handleEdit = (item) => {
    // console.log("Edit", item);
    setShowFormEdit(true)
    setItemEdit(item)
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa danh mục này?");
    if (!confirmDelete) return;

    try {
      const result = await deleteCategories(id);
      // console.log("Xóa thành công:", result);
      alert(result.message);
      onReload(Date.now());
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Xóa danh mục thất bại!");
    }
  };

  const handleRestore = async (id) => {
    try {
      const result = await reStoreCategories(id);
      // console.log("Khôi phục thành công:", result);
      alert(result.message);
      onReload(Date.now());
    } catch (error) {
      console.error("Lỗi khi khôi phục:", error);
      alert("Khôi phục danh mục thất bại!");
    }
  };


  return (
    <>
      {showFormEdit && <EditCategoryForm onClose={() => setShowFormEdit(false)} item={itemEdit} onReload={() => onReload(Date.now())} />}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Mô tả</th>
            <th>Người tạo</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((item, i) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td className="description">{item.description}</td>
              <td>{item.createdBy}</td>
              <td>{item.createdAt}</td>
              <td style={{ textAlign: "center" }}>{item.status}</td>
              <td className="actions" style={{ position: "relative" }}>
                <Image
                  src={icon}
                  alt="Icon"
                  onClick={() => toggleMenu(i)}
                  style={{ cursor: "pointer" }}
                />

                {openMenuIndex === i && (
                  <div className="action-menu">
                    <button onClick={() => handleEdit(item)}>Sửa</button>
                    {item.status === "ACTIVE" ? (
                      <button onClick={() => handleDelete(item.id)}>Xóa</button>
                    ) : (
                      <button onClick={() => handleRestore(item.id)}>Khôi phục</button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="category-table__pagination">
        {renderPagination()}
      </div>
    </>
  );

}
