import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const uploadImg = async (data) => {
  try {
    // Tạo request upload ảnh
    const response = await axios.post(`${base_url}upload/`, data, config);
    return response.data.images;
  } catch (error) {
    throw error; // Ném ra lỗi nếu có
  }
};
const deleteImg = async (id) => {
  const response = await axios.delete(
    `${base_url}upload/delete-img/${id}`,

    config
  );
  return response.data;
};

const uploadService = {
  uploadImg,
  deleteImg,
};

export default uploadService;
