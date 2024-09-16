import React, { useState, useEffect } from "react";
import { message } from "antd";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { base_url } from "../utils/baseUrl"; // Ensure the base URL is correctly set
import { config } from "../utils/axiosconfig"; // Config for headers

const OrderDetailsDialog = ({ open, handleClose, orderDetails, userName }) => {
  const [orderStatus, setOrderStatus] = useState(""); // Initialize as an empty string

  // Update orderStatus when orderDetails change
  useEffect(() => {
    if (orderDetails) {
      setOrderStatus(orderDetails.orderStatus); // Set order status when order details are available
    }
  }, [orderDetails]);

  // Handle order status change
  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setOrderStatus(newStatus);

    try {
      // Call the API to update the order status
      await axios.put(
        `${base_url}payment/order/${orderDetails?._id}/status`,
        { orderStatus: newStatus },
        config
      );
      // Show success message
      message.success("Thay đổi trạng thái đơn hàng thành công.");
    } catch (error) {
      // Handle any errors
      message.error("Thay đổi trạng thái đơn hàng thất bại.");
      console.error("Error updating order status:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết đơn hàng</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
          Tên người dùng: {userName}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Sản phẩm:
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>
                  Tên sản phẩm
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Số lượng</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Màu sắc</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetails?.products?.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.product?.title || "N/A"}</TableCell>
                  <TableCell>{product.count}</TableCell>
                  <TableCell>{product.color}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
          Thành tiền: {orderDetails?.totalAmount?.toLocaleString()} VNĐ
        </Typography>
        <Typography variant="h6">
          Thời gian: {new Date(orderDetails?.createdAt).toLocaleString()}
        </Typography>

        {/* Order Status Select */}
        <FormControl fullWidth style={{ marginTop: "20px" }}>
          <InputLabel>Trạng thái đơn hàng</InputLabel>
          <Select value={orderStatus} onChange={handleStatusChange}>
            <MenuItem value="Cash on Delivery">Cash on Delivery</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Not Processed">Not Processed</MenuItem>
            <MenuItem value="Processing">Processing</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
