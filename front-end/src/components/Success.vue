<template>
  <div v-if="order" class="container d-flex flex-column justify-content-center align-items-center"
    style="height: 100vh; text-align: center;">
    <div class="status-icon mb-4">
      <font-awesome-icon
        :icon="status === '00' || status === '0' ? ['far', 'circle-check'] : ['fas', 'triangle-exclamation']"
        :class="status === '00' || status === '0' ? 'text-success' : 'text-danger'" style="font-size: 120px;" />
    </div>
    <h2 class="status-message fw-bold">
      {{ status === '00' || status === '0' ? 'Thanh toán thành công!' : 'Thanh toán thất bại' }}
    </h2>
    <p class="status-description mt-3 text-secondary">
      {{ status === '00' ? 'Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xử lý.' : 'Đã xảy ra lỗi khi xử lý thanh toán.Vui lòng thử lại sau.' }}
    </p>
    <div class="action-buttons mt-4">
      <router-link to="/san-pham" class="btn btn-outline-danger me-3 d-flex align-items-center">
        <font-awesome-icon :icon="['fas', 'house-chimney']" class="me-2" />
        Trang chủ
      </router-link>
      <router-link to="/lich-su-mua-hang" class="btn btn-outline-primary d-flex align-items-center">
        <font-awesome-icon :icon="['fas', 'clock-rotate-left']" class="me-2" />
        Lịch sử mua hàng
      </router-link>
    </div>
  </div>
  <div v-else class="loading-container d-flex justify-content-center align-items-center" style="height: 100vh;">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Đang tải...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const order = ref(null);
const route = useRoute();
const API_URL = 'http://127.0.0.1:8000';

const user_id = localStorage.getItem('user_id');
const status = ref('');
onMounted(async () => {
  status.value = route.query.status;
  const orderId = route.query.order_id;

  if (orderId) {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      order.value = response.data;

      if (status.value === '00') {
        await clearCart();
      }
    } catch (error) {
      console.error('Không thể lấy thông tin đơn hàng:', error);
    }
  }
});

const clearCart = async () => {
  try {
    const response = await axios.delete(`${API_URL}/api/cart/clear/${user_id}`);
    if (response.status === 200) {
      console.log('Cart cleared successfully');
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};
</script>

<style scoped>
.status-icon {
  animation: bounce 1s infinite;
}

.status-message {
  font-size: 1.8rem;
}

.status-description {
  font-size: 1.1rem;
}

.action-buttons .btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}
</style>
