import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useLocation, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import {
  createProducts,
  resetState,
  getAProduct,
  updateAProduct,
} from "../features/product/productSlice";

let schema = yup.object().shape({
  title: yup.string().required("*Nhập tiêu đề"),
  description: yup.string().required("*Nhập mô tả sản phẩm"),
  price: yup.number().required("*Nhập giá sản phẩm"),
  brand: yup.string().required("*Nhập thương hiệu sản phẩm"),
  category: yup.string().required("*Chọn loại sản phẩm"),
  tags: yup.string().required("*Chọn tag sản phẩm"),
  color: yup
    .array()
    .min(1, "Chọn màu sản phẩm")
    .required("*Màu sản phẩm là bắt buộc"),
  quantity: yup.number().required("*Nhập số lượng sản phẩm"),
});

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);
  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const imgState = useSelector((state) => state.upload.images || []);

  const newProduct = useSelector((state) => state.product);
  const location = useLocation();
  const getProductId = location.pathname.split("/")[3]; // Lấy ra tên sản phẩm

  const {
    productTilte,
    productDescription,
    productPrice,
    productCategory,
    productTags,
    productColor,
    productQuantity,
    productImage,
    productBrand,
    isSuccess,
    isError,
    isLoading,
    createdProduct,
    updateProduct,
  } = newProduct;

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
  }, [dispatch]);

  useEffect(() => {
    if (getProductId !== undefined) {
      dispatch(getAProduct(getProductId));
    } else {
      dispatch(resetState());
    }
  }, [dispatch, getProductId]);

  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Thêm sản phẩm thành công!");
    }
    if (isError) {
      toast.error("Đã có lỗi xảy ra!");
    }
    if (isSuccess && updateProduct) {
      toast.success("Cập nhật sản phẩm thành công!");
      navigate("/admin/list-product");
    }
  }, [isSuccess, isError, isLoading, createdProduct, updateProduct, navigate]);

  const colorOptions = colorState.map((i) => ({
    value: i.title,
  }));

  useEffect(() => {
    setImages(
      imgState.map((i) => ({
        public_id: i.public_id,
        url: i.url,
      }))
    );
  }, [imgState]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: productTilte || "",
      description: productDescription || "",
      price: productPrice || "",
      brand: productBrand || "",
      category: productCategory || "",
      tags: productTags || "",
      color: productColor || [], // Khởi tạo `color` là mảng
      quantity: productQuantity || "",
      images: productImage || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      values.images = images; // Gắn hình ảnh đã tải lên vào values
      if (getProductId !== undefined) {
        const data = { id: getProductId, productData: values };
        dispatch(updateAProduct(data));
      } else {
        dispatch(createProducts(values));
      }
      formik.resetForm();
      setTimeout(() => {
        dispatch(resetState());
        navigate("/admin/list-product");
      }, 3000);
    },
  });

  const handleColors = (value) => {
    setColor(value);
    formik.setFieldValue("color", value); // Cập nhật giá trị màu vào formik
  };

  return (
    <div>
      <h3 className="mb-4 title">
        {getProductId !== undefined ? "Cập nhật" : "Thêm"} sản phẩm
      </h3>
      <div>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <CustomInput
            type="text"
            label="Nhập tiêu đề sản phẩm"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className="">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
            />
          </div>
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
          <CustomInput
            type="number"
            label="Nhập giá sản phẩm"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>
          <select
            name="brand"
            onChange={formik.handleChange("brand")}
            onBlur={formik.handleBlur("brand")}
            value={formik.values.brand}
            className="form-control py-3 mb-3"
          >
            <option value="">Chọn thương hiệu </option>
            {brandState.map((i, j) => (
              <option key={j} value={i.title}>
                {i.title}
              </option>
            ))}
          </select>
          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3 mb-3"
          >
            <option value="">Chọn loại sản phẩm </option>
            {catState.map((i, j) => (
              <option key={j} value={i.title}>
                {i.title}
              </option>
            ))}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>
          <select
            name="tags"
            onChange={formik.handleChange("tags")}
            onBlur={formik.handleBlur("tags")}
            value={formik.values.tags}
            className="form-control py-3 mb-3"
          >
            <option value="" disabled>
              Chọn Tag
            </option>
            <option value="featured">Featured</option>
            <option value="popular">Popular</option>
            <option value="special">Special</option>
          </select>
          <div className="error">
            {formik.touched.tags && formik.errors.tags}
          </div>

          <Select
            mode="multiple"
            allowClear
            className="w-100"
            placeholder="Chọn màu sắc"
            defaultValue={formik.values.color} // Sử dụng formik.values.color
            onChange={handleColors}
            options={colorOptions}
          />
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div>

          <CustomInput
            type="number"
            label="Nhập số lượng sản phẩm"
            name="quantity"
            onChng={formik.handleChange("quantity")}
            onBlr={formik.handleBlur("quantity")}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>
          <div className="bg-white border-1 p-5 text-center">
            <Dropzone
              onDrop={(acceptedFiles) => {
                if (acceptedFiles.length > 0) {
                  dispatch(uploadImg(acceptedFiles));
                } else {
                  console.error("Không có file nào được chọn.");
                }
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className="showimages d-flex flex-wrap gap-3">
            {images.map((img, index) => (
              <div className="position-relative" key={index}>
                <button
                  type="button"
                  onClick={() => dispatch(delImg(img.public_id))}
                  className="btn-close position-absolute"
                  style={{ top: "10px", right: "10px" }}
                ></button>
                <img src={img.url} alt="" width={200} height={200} />
              </div>
            ))}
          </div>

          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getProductId !== undefined ? "Cập nhật" : "Thêm"} sản phẩm
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
