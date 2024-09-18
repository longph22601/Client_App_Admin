import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModal";
import { SearchProduct } from "../components/SearchProduct";
import productService from "../features/product/productService"; // Import productService

const columns = [
  {
    title: "STT",
    dataIndex: "key",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
  },
  {
    title: "Thương hiệu",
    dataIndex: "brand",
    sorter: (a, b) => a.brand.length - b.brand.length,
  },
  {
    title: "Loại sản phẩm",
    dataIndex: "category",
    sorter: (a, b) => a.category.length - b.category.length,
  },
  {
    title: "Màu sắc",
    dataIndex: "color",
  },
  {
    title: "Giá",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Hành động",
    dataIndex: "action",
  },
];

const Productlist = () => {
  const [open, setOpen] = useState(false);
  const [productID, setProductId] = useState("");
  const [products, setProducts] = useState([]);

  // Hàm gọi API lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts(); // Gọi hàm từ productService
      setProducts(response); // Lưu dữ liệu sản phẩm
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      message.error("Lỗi khi tải danh sách sản phẩm.");
    }
  };

  // Hàm gọi API để xóa sản phẩm
  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id); // Gọi hàm delete từ productService
      message.success("Xóa sản phẩm thành công!");
      fetchProducts(); // Gọi lại để cập nhật danh sách sản phẩm
      setOpen(false); // Đóng modal
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      message.error("Xóa sản phẩm thất bại.");
    }
  };

  useEffect(() => {
    fetchProducts(); // Lấy danh sách sản phẩm khi component được render
  }, []);

  const showModal = (id) => {
    setOpen(true);
    setProductId(id); // Lưu ID sản phẩm cần xóa
  };

  const hideModal = () => {
    setOpen(false);
  };

  const data1 = [];
  for (let i = 0; i < products.length; i++) {
    data1.push({
      key: i + 1,
      title: products[i].title,
      brand: products[i].brand,
      category: products[i].category,
      color: products[i].color,
      price: `${products[i].price}`,
      action: (
        <>
          <Link
            to={`/admin/product/${products[i]._id}`} // Chuyển sang trang update sản phẩm
            className=" fs-3 text-danger"
          >
            <BiEdit />
          </Link>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(products[i]._id)}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }

  return (
    <div>
      <div className="row align-item-center">
        <div className="col-6">
          <h3 className="mb-4 title">Danh sách sản phẩm</h3>
        </div>
        <div className="col-6">
          <SearchProduct />
        </div>
      </div>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      {/* Modal xác nhận xóa sản phẩm */}
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteProduct(productID); // Xóa sản phẩm được chọn
        }}
        title="Bạn có chắc chắn muốn xóa?"
      />
    </div>
  );
};

export default Productlist;
