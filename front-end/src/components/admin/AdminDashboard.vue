<template>
  <div id="layoutSidenav_content">
    <main>
      <div class="container-fluid px-4" style="margin-top: 80px;">
        <!-- Tiêu đề -->
        <h1 class="mt-4 text-primary text-center border-bottom pb-2">Bảng Điều Khiển</h1>
        
        <!-- Hàng chứa các thẻ thông tin -->
        <div class="row mt-4">
          <!-- Thẻ 1: Số đơn hàng -->
          <div class="col-md-6">
            <div class="card text-center shadow-sm rounded hover-card">
              <div class="card-body bg-gradient-success text-white rounded">
                <i class="bi bi-graph-up fs-1 text-white"></i>
                <h6 class="mt-2">Số đơn hàng</h6>
                <h5 class="fw-bold">{{ orders.length }} đơn</h5>
              </div>
            </div>
          </div>

          <!-- Thẻ 2: Số người dùng
          <div class="col-md-4">
            <div class="card text-center shadow-sm rounded hover-card">
              <div class="card-body bg-gradient-primary text-white rounded">
                <i class="bi bi-person-fill fs-1 text-white"></i>
                <h6 class="mt-2">Số người dùng</h6>
                <h5 class="fw-bold">{{ users.length }} người</h5>
              </div>
            </div>
          </div> -->

          <!-- Thẻ 3: Doanh thu tổng -->
          <div class="col-md-6">
            <div class="card text-center shadow-sm rounded hover-card">
              <div class="card-body bg-gradient-danger text-white rounded">
                <i class="bi bi-graph-up-arrow fs-1 text-white"></i>
                <h6 class="mt-2">Doanh thu tổng</h6>
                <h5 class="fw-bold">{{ totalRevenueFormatted }}</h5>
              </div>
            </div>
          </div>
        </div>

        <!-- Hàng chứa biểu đồ -->
        <div class="row mt-4">
          <!-- Biểu đồ doanh thu theo ngày -->
          <div class="col-md-6">
            <div class="card shadow rounded mb-4">
              <div class="card-header bg-light text-dark fw-bold">
                <font-awesome-icon :icon="['fas', 'chart-column']" /> Doanh thu theo ngày
              </div>
              <div class="card-body">
                <LineChart :chartData="dailyRevenueData" :options="chartOptions" />
              </div>
            </div>
          </div>

          <!-- Biểu đồ doanh thu theo tháng -->
          <div class="col-md-6">
            <div class="card shadow rounded mb-4">
              <div class="card-header bg-light text-dark fw-bold">
                <font-awesome-icon :icon="['fas', 'chart-simple']" /> Doanh thu theo tháng
              </div>
              <div class="card-body">
                <BarChart :chartData="monthlyRevenueData" :options="chartOptions" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
h1 {
  font-family: 'Poppins', sans-serif;
  color: #3b3b3b;
}

.card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.hover-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.bg-gradient-success {
  background: linear-gradient(to right, #28a745, #218838);
}

.bg-gradient-primary {
  background: linear-gradient(to right, #007bff, #0056b3);
}

.bg-gradient-danger {
  background: linear-gradient(to right, #dc3545, #bd2130);
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { LineChart, BarChart } from 'vue-chart-3';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, LineController, BarController, PointElement } from 'chart.js';

const API_URL = 'http://127.0.0.1:8000';
const users = ref([]);
const orders = ref([]);

const token = localStorage.getItem('token');

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  BarController,
  PointElement
);

// Dữ liệu chart cho doanh thu theo ngày
const dailyRevenueData = ref({
  labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
  datasets: [
    {
      label: 'Doanh thu ($)',
      data: [0, 0, 0, 0, 0, 0, 0],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    },
  ],
});

// Dữ liệu chart cho doanh thu theo tháng (Cập nhật để có 12 tháng)
const monthlyRevenueData = ref({
  labels: [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ],
  datasets: [
    {
      label: 'Doanh thu ($)',
      data: new Array(12).fill(0),
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
    },
  ],
});

// Dữ liệu chart cho số đơn hàng theo ngày trong tuần
const dailyOrdersData = ref({
  labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
  datasets: [
    {
      label: 'Số đơn hàng',
      data: new Array(7).fill(0), // Mảng 7 phần tử đại diện cho 7 ngày trong tuần
      borderColor: 'rgba(255, 159, 64, 1)',
      backgroundColor: 'rgba(255, 159, 64, 0.2)',
    },
  ],
});

// Dữ liệu chart cho số người dùng theo tháng
const monthlyUsersData = ref({
  labels: [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ],
  datasets: [
    {
      label: 'Số người dùng',
      data: new Array(12).fill(0), // Mảng 12 phần tử đại diện cho 12 tháng trong năm
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)',
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
  },
});

// Fetch dữ liệu người dùng
const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    users.value = response.data;
    getMonthlyUsers();  // Cập nhật số người dùng theo tháng
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// Fetch dữ liệu đơn hàng
const fetchOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/orders`);
    orders.value = response.data;
    getDailyRevenue();  // Cập nhật doanh thu theo ngày
    getMonthlyRevenue();  // Cập nhật doanh thu theo tháng
    getDailyOrders();  // Cập nhật số đơn hàng theo ngày
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

// Tính toán doanh thu theo ngày
const getDailyRevenue = () => {
  const dailyRevenue = new Array(7).fill(0);
  orders.value.forEach(order => {
    const orderDate = new Date(order.created_at);
    const dayOfWeek = orderDate.getDay();
    dailyRevenue[dayOfWeek] += parseFloat(order.total_price);
  });
  dailyRevenueData.value.datasets[0].data = dailyRevenue;
};

// Tính toán doanh thu theo tháng
const getMonthlyRevenue = () => {
  const monthlyRevenue = new Array(12).fill(0);
  orders.value.forEach(order => {
    const orderDate = new Date(order.created_at);
    const month = orderDate.getMonth();
    monthlyRevenue[month] += parseFloat(order.total_price);
  });
  monthlyRevenueData.value.datasets[0].data = monthlyRevenue;
};

// Tính toán số đơn hàng theo ngày trong tuần
const getDailyOrders = () => {
  const dailyOrders = new Array(7).fill(0);
  orders.value.forEach(order => {
    const orderDate = new Date(order.created_at);
    const dayOfWeek = orderDate.getDay();
    dailyOrders[dayOfWeek] += 1; // Cộng thêm 1 cho số đơn hàng
  });
  dailyOrdersData.value.datasets[0].data = dailyOrders;
};

// Tính toán số người dùng theo tháng
const getMonthlyUsers = () => {
  const monthlyUsers = new Array(12).fill(0);
  users.value.forEach(user => {
    const userDate = new Date(user.created_at);
    const month = userDate.getMonth();
    monthlyUsers[month] += 1; // Cộng thêm 1 cho mỗi người dùng
  });
  monthlyUsersData.value.datasets[0].data = monthlyUsers;
};

// Tính tổng doanh thu
const totalRevenueFormatted = computed(() => {
  const revenue = orders.value.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
  return formatVND(revenue);
});

// Hàm định dạng VND
const formatVND = (amount) => {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

// Lấy dữ liệu khi trang được load
onMounted(() => {
  fetchUsers();
  fetchOrders();
});
</script>

