import React from "react";
import { BsSearch } from "react-icons/bs";
import { useFormik } from "formik";
import axios from "axios";
import { base_url } from "../utils/baseUrl"; // Import base_url from the config file

export const SearchProduct = ({ setSearchResults }) => {
  // Formik setup for search
  const formik = useFormik({
    initialValues: {
      keyword: "",
    },
    onSubmit: async (values) => {
      try {
        let response;
        // Check if the keyword is empty
        if (values.keyword.trim() === "") {
          response = await axios.get(`${base_url}product`);
        } else {
          response = await axios.get(
            `${base_url}product/search?keyword=${values.keyword}`
          );
        }
        setSearchResults(response.data); // Update search results in the parent component
      } catch (error) {
        console.error("Search error:", error.message);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="input-group mb-3">
      <input
        type="text"
        className="form-control py-2"
        placeholder="Nhập mã sản phẩm ở đây"
        aria-label="Nhập mã sản phẩm ở đây"
        aria-describedby="basic-addon2"
        name="keyword"
        value={formik.values.keyword}
        onChange={formik.handleChange}
      />
      <button type="submit" className="input-group-text" id="basic-addon2">
        <BsSearch />
      </button>
    </form>
  );
};
