<template>
    <section class="shop1 text-center">
      <span class="crumb-border"></span>
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
            <ul class="breadcrumb">
              <li class="home">
                <router-link to="/"><b>Trang chủ </b></router-link>
                <span class="icon-arrow-right text-danger">
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </span>
              </li>
              <li><strong><span class="text-danger"> Lịch sử mua hàng</span></strong></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <div class="order-history container mt-5" style="min-height: 100vh;">
      <h2 class="mb-4">Đơn hàng đã mua gần đây</h2>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Mã đơn hàng</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in orders" :key="order.id">
              <td>{{ index + 1 }}</td>
              <td>{{ order.id }}</td>
              <td>{{ formatDate(order.created_at) }}</td>
              <td>
                <span :class="statusClass(order.status)">{{ order.status }}</span>
              </td>
              <td>{{ formatCurrency(order.total_price) }}</td>
              <td>
                <button class="btn btn-primary btn-sm" @click="viewDetails(order)">
                  Xem chi tiết
                </button>
              </td>
            </tr>
            <tr v-if="orders.length === 0">
              <td colspan="5">Không có đơn hàng</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Chi tiết đơn hàng -->
      <div v-if="selectedOrder" class="order-details mt-4">
        <h3>Chi tiết đơn hàng</h3>
        <p><strong>Mã đơn hàng:</strong> {{ selectedOrder.id }}</p>
        <p><strong>Ngày đặt:</strong> {{ formatDate(selectedOrder.created_at) }}</p>
        <p><strong>Trạng thái:</strong> {{ selectedOrder.status }}</p>
        <p><strong>Tổng tiền:</strong> {{ formatCurrency(selectedOrder.total_price) }}</p>
        <h4>Danh sách sản phẩm:</h4>
        <div class="order-items">
          <div v-for="item in selectedOrder.order_details" :key="item.id" class="order-item d-flex align-items-center mb-3">
            <div>
              <p class="mb-1"><strong>{{ item.product.name }}</strong></p>
              <p class="mb-1">Số lượng: {{ item.quantity }}</p>
              <p class="mb-1">Đơn giá: {{ formatCurrency(item.price) }}</p>
              <p class="mb-1">Mô tả: {{ item.product.description }}</p>
            </div>
            <button class="btn btn-success btn-sm ms-auto" @click="buyAgain(item)">
              Mua lại
            </button>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm mt-3" @click="selectedOrder = null">
          Đóng
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const API_URL = 'http://127.0.0.1:8000';
  const orders = ref([]);
  const user_id = localStorage.getItem('user_id');
  
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders/user/${user_id}`);
      orders.value = response.data;
    } catch (error) {
      console.error(error);
    }
  }
  
  const selectedOrder = ref(null);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };
  
  const statusClass = (status) => {
    switch (status) {
      case "paid":
        return "badge bg-success";
      case "pending":
        return "badge bg-warning";
      case "canceled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };
  
  const viewDetails = (order) => {
    selectedOrder.value = order;
  };
  
  const buyAgain = (item) => {
    alert(`Mua lại sản phẩm: ${item.product.name}`);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return new Intl.DateTimeFormat('vi-VN', options).format(date);
  }
  
  onMounted(() => {
    fetchOrders();
  });
  </script>
  
  <style scoped>
  .order-history {
    font-family: Arial, sans-serif;
  }
  
  .order-details {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  
  .table th,
  .table td {
    text-align: center;
    vertical-align: middle;
  }
  
  .order-item {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    background-color: #fff;
  }
  
  .item-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  </style>
  