// Orders.js
import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import { base_url } from "../utils/baseUrl"; // Ensure the base URL is correctly set
import { config } from "../utils/axiosconfig"; // Config for headers
import { getOrders, resetState } from "../features/auth/authSlice";
import OrderDetailsDialog from "../components/OrderDetailsDialog"; // Import the dialog component

const columns = [
  {
    title: "STT",
    dataIndex: "key",
  },
  {
    title: "Tên người dùng",
    dataIndex: "name",
  },
  {
    title: "Sản phẩm",
    dataIndex: "product",
  },
  {
    title: "Thành tiền",
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

const Orders = () => {
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userName, setUserName] = useState(""); // State to hold the user's name

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetState());
    dispatch(getOrders());
  }, [dispatch]);

  const orderState = useSelector((state) => state.auth.orders);

  // Fetch order details by order ID
  const fetchOrderDetails = async (orderId, name) => {
    try {
      const response = await axios.get(
        `${base_url}payment/order/${orderId}`,
        config
      );
      setSelectedOrder(response.data);
      setUserName(name); // Set the user's name from the order data
      setOpen(true);
    } catch (error) {
      message.error("Failed to fetch order details");
      console.error("Error fetching order details:", error);
    }
  };

  const hideModal = () => {
    setOpen(false);
    setSelectedOrder(null);
    setUserName(""); // Reset the user's name
  };

  const data1 = orderState.map((order, index) => ({
    key: index + 1,
    name: order.orderby.firstname,
    product: (
      <span
        style={{ color: "#007bff", cursor: "pointer" }}
        onClick={() => fetchOrderDetails(order._id, order.orderby.firstname)} // Pass user's name when fetching details
      >
        View Orders
      </span>
    ),
    amount: order.paymentIntent?.amount,
    date: new Date(order.createdAt).toLocaleString(),
    action: (
      <>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => fetchOrderDetails(order._id, order.orderby.firstname)}
        >
          <BiEdit />
        </button>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => alert(`Delete order ${order._id} functionality here`)}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  return (
    <div>
      <h3 className="mb-4 title">Danh sách đơn hàng</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      {/* Order details dialog */}
      <OrderDetailsDialog
        open={open}
        handleClose={hideModal}
        orderDetails={selectedOrder}
        userName={userName} // Pass the user's name to the dialog
      />
    </div>
  );
};

export default Orders;
