<template>
  <div class="container" style="height: 55vh;">
    <div class="login-form">
      <h2 class="text-center text-bold">ĐĂNG NHẬP</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
          <input type="email" class="form-control" id="email" v-model="formData.email"
            :class="{ 'is-invalid': errors.email }" placeholder="Email">
          <div class="invalid-feedback" v-if="errors.email">
            {{ errors.email }}
          </div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mật khẩu <span class="text-danger">*</span></label>
          <input type="password" class="form-control" id="password" v-model="formData.password"
            :class="{ 'is-invalid': errors.password }" placeholder="Mật khẩu">
          <div class="invalid-feedback" v-if="errors.password">
            {{ errors.password }}
          </div>
        </div>
        <div class="mb-3 text-center">
          <router-link to="/quen-mat-khau" class="text-decoration-none text-dark">Quên mật khẩu? Nhấn vào đây</router-link>
        </div>
        <button type="submit" class="btn btn-login w-100" :disabled="isLoading">
          {{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
        </button>
        <div class="text-center mt-3">
          <router-link to="/register" class="text-decoration-none text-dark">
            Chưa có tài khoản? Đăng ký
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import swal from 'sweetalert';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const API_URL = 'http://127.0.0.1:8000';
const isLoading = ref(false);

const formData = reactive({
  email: '',
  password: ''
});

const errors = reactive({
  email: '',
  password: ''
});

const validateForm = () => {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '');

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email) {
    errors.email = 'Vui lòng nhập email';
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Email không hợp lệ';
    isValid = false;
  } else {
    errors.email = '';
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Vui lòng nhập mật khẩu';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    const response = await axios.post(`${API_URL}/api/login`, {
      email: formData.email,
      password: formData.password,
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

const userResponse = await axios.get(`${API_URL}/api/user`);
const userId = userResponse.data.id;
const userRole = userResponse.data.role;

localStorage.setItem('user_id', userId);
localStorage.setItem('role', userRole);
localStorage.setItem('isLogin', 'true');

swal({
  title: "Đăng nhập thành công!",
  text: "Chào mừng bạn trở lại!",
  icon: "success",
  timer: 3000,
  buttons: false,
}).then(() => {
  window.location.href = '/san-pham';
});
}
} catch (error) {
console.log('Error response:', error.response?.data);

// Xử lý lỗi đăng nhập
if (error.response?.data?.errors) {
Object.keys(error.response.data.errors).forEach((key) => {
  errors[key] = error.response.data.errors[key][0];
});
} else if (error.response?.data?.message) {
swal({
  title: "Lỗi!",
  text: error.response.data.message,
  icon: "error",
  timer: 3000,
  buttons: false,
});
} else {
swal({
  title: "Đăng nhập thất bại!",
  text: "Vui lòng kiểm tra lại thông tin!",
  icon: "error",
  timer: 3000,
  buttons: false,
});
}
} finally {
isLoading.value = false;
}
};

</script>
<style scoped>

.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px 25px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 80px;
  text-align: center;
  transition: all 0.3s ease-in-out;
}

.login-form:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Tiêu đề */
.login-form h2 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

/* Nhãn */
.form-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
  text-align: left;
  display: block;
}

/* Input tuỳ chỉnh */
.custom-input, 
.form-control {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.custom-input:focus, 
.form-control:focus {
  border-color: #0072ff;
  box-shadow: 0 0 8px rgba(0, 114, 255, 0.3);
}

/* Nút đăng nhập */
.btn-login {
  background: linear-gradient(90deg, #0072ff, #00c6ff);
  color: white;
  font-weight: bold;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 114, 255, 0.4);
}

.btn-login:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Link */
.text-dark {
  color: #666;
  font-size: 0.9rem;
}

.text-dark:hover {
  color: #0072ff;
  text-decoration: underline;
}

.text-center .text-dark {
  margin-top: 15px;
}

/* Invalid feedback */
.invalid-feedback {
  font-size: 0.8rem;
  color: #e74c3c;
  margin-top: 5px;
}

/* Responsive */
@media (max-width: 768px) {
  .login-form {
    padding: 15px 20px;
    margin-top: 60px;
  }

  .login-form h2 {
    font-size: 1.5rem;
  }

  .btn-login {
    font-size: 0.9rem;
  }
}

</style>
