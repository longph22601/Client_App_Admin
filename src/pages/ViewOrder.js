import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { getOrderByUser, getOrders, resetState } from "../features/auth/authSlice";
import CustomModal from "../components/CustomModal";
const columns = [
  {
    title: "STT",
    dataIndex: "key",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
  },
  {
    title: "Thương hiệu",
    dataIndex: "brand",
  },
  {
    title: "Số lượng",
    dataIndex: "count",
  },
  {
    title: "Màu sắc",
    dataIndex: "color",
  },
  {
    title: "Tổng tiền",
    dataIndex: "amount",
  },
  {
    title: "Thời gian",
    dataIndex: "date",
  },

  {
    title: "Hành động",
    dataIndex: "action",
  },
];

const ViewOrder = () => {
  const [open, setOpen] = useState(false);
  const setOrderByUser = useState("");
  const location = useLocation();
  const userId = location.pathname.split("/")[3];
  const dispatch = useDispatch();
  
  const showModal = (e) => {
    setOpen(true);
    setOrderByUser(e);
  };
  const hideModal = () => {
    setOpen(false);
  };
  useEffect(() => {
    dispatch(resetState());
    dispatch(getOrderByUser(userId));
  }, []);
  const orderState = useSelector((state) => state.product.products);
  console.log(orderState);
  const data1 = [];
  for (let i = 0; i < orderState.length; i++) {
    data1.push({
      key: i + 1,
      name: orderState[i].product.title,
      brand: orderState[i].product.brand,
      count: orderState[i].count,
      amount: orderState[i].product.price,
      color: orderState[i].product.color,
      date: orderState[i].product.createdAt,
      action: (
        <>
          <Link to={`/admin/order/${orderState[i].orderbyuser}`}
            className=" fs-3 text-danger">
            <BiEdit />
          </Link>
          <button className="ms-3 fs-3 text-danger"
            onClick={() => showModal(orderState[i].orderbyuser)}>
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }
  return (
    <div>
      <h3 className="mb-4 title">View Order</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default ViewOrder;
