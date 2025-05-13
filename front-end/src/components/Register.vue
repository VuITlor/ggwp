<template>
  <div class="container" style="height: 70vh;">
    <div class="register-form">
      <h2 class="text-center fw-bold text-primary">Đăng Ký</h2>
      <form @submit.prevent="handleSubmit">
        <!-- Username -->
        <div class="mb-3">
          <label for="username" class="form-label">Username <span class="text-danger">*</span></label>
          <input type="text" class="form-control custom-input" id="username" v-model="formData.username"
            :class="{ 'is-invalid': errors.username }" placeholder="Nhập username" required />
          <div class="invalid-feedback" v-if="errors.username">
            {{ errors.username }}
          </div>
        </div>

        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
          <input type="email" class="form-control custom-input" id="email" v-model="formData.email"
            :class="{ 'is-invalid': errors.email }" placeholder="Nhập email" required />
          <div class="invalid-feedback" v-if="errors.email">
            {{ errors.email }}
          </div>
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label for="password" class="form-label">Mật khẩu <span class="text-danger">*</span></label>
          <input type="password" class="form-control custom-input" id="password" v-model="formData.password"
            :class="{ 'is-invalid': errors.password }" placeholder="Nhập mật khẩu" required />
          <div class="invalid-feedback" v-if="errors.password">
            {{ errors.password }}
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Xác nhận mật khẩu <span class="text-danger">*</span></label>
          <input type="password" class="form-control custom-input" id="confirmPassword"
            v-model="formData.confirmPassword" :class="{ 'is-invalid': errors.confirmPassword }"
            placeholder="Xác nhận mật khẩu" required />
          <div class="invalid-feedback" v-if="errors.confirmPassword">
            {{ errors.confirmPassword }}
          </div>
        </div>

        <!-- Terms -->
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input custom-checkbox" id="terms" v-model="formData.terms"
            :class="{ 'is-invalid': errors.terms }" />
          <label class="form-check-label" for="terms">Tôi đồng ý với điều khoản</label>
          <div class="invalid-feedback" v-if="errors.terms">
            {{ errors.terms }}
          </div>
        </div>

        <!-- Nút Đăng ký -->
        <button type="submit" class="btn btn-gradient w-100" :disabled="isLoading">
          {{ isLoading ? 'Đang xử lý...' : 'Đăng ký' }}
        </button>

        <!-- Đăng nhập -->
        <div class="text-center mt-3">
          <router-link to="/login" class="text-decoration-none link-primary">
            Đã có tài khoản? <span class="fw-bold">Đăng nhập</span>
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import swal from 'sweetalert'; // Import SweetAlert

const router = useRouter();
const API_URL = 'http://127.0.0.1:8000';
const isLoading = ref(false);

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
});

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: ''
});

const validateForm = () => {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '');

  // Username validation
  if (formData.username.length < 3) {
    errors.username = 'Username phải có ít nhất 3 ký tự';
    isValid = false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    errors.email = 'Email không hợp lệ';
    isValid = false;
  }

  // Password validation
  if (formData.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    isValid = false;
  }

  // Confirm password validation
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu không khớp';
    isValid = false;
  }

  // Terms validation
  if (!formData.terms) {
    errors.terms = 'Bạn phải đồng ý với điều khoản';
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
    const response = await axios.post(`${API_URL}/api/register`, {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword
    });

    if (response.data) {
      swal("Đăng ký thành công!", "Bạn đã đăng ký thành công. Hãy đăng nhập ngay!", "success"); // Hiển thị thông báo thành công
      router.push('/login');
    }
  } catch (error) {
    console.log('Error response:', error.response?.data);

    if (error.response?.data?.errors) {
      // Xử lý lỗi validation từ Laravel
      Object.keys(error.response.data.errors).forEach(key => {
        errors[key === 'password_confirmation' ? 'confirmPassword' : key] =
          error.response.data.errors[key][0];
      });
    } else if (error.response?.data?.message) {
      // Hiển thị thông báo lỗi chung nếu có
      swal("Lỗi", error.response.data.message, "error"); // Hiển thị thông báo lỗi
    } else {
      swal("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại sau!", "error"); // Thông báo lỗi chung
    }
  } finally {
    isLoading.value = false;
  }
};
</script>


<style scoped>
/* Form đăng ký */
.register-form {
  max-width: 500px;
  margin: 50px auto;
  padding: 25px 30px;
  background: linear-gradient(145deg, #f3f4f6, #ffffff);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin-top: 125px;
}

/* Tiêu đề */
.register-form h2 {
  margin-bottom: 20px;
}

/* Input tuỳ chỉnh */
.custom-input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.custom-input:focus {
  border-color: #00b74a;
  box-shadow: 0 0 5px rgba(0, 183, 74, 0.5);
}

/* Checkbox tuỳ chỉnh */
.custom-checkbox {
  accent-color: #0072ff;
}

/* Nút đăng ký */
.btn-gradient {
  background: linear-gradient(90deg, #00c6ff, #0072ff);
  color: white;
  font-weight: bold;
  padding: 12px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-gradient:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 15px rgba(0, 114, 255, 0.4);
}

.btn-gradient:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Link */
.link-primary {
  color: #0072ff;
  font-weight: bold;
}

.link-primary:hover {
  color: #0056cc;
  text-decoration: underline;
}

/* Invalid feedback */
.invalid-feedback {
  font-size: 0.9rem;
  color: #e74c3c;
}

/* Responsive */
@media (max-width: 768px) {
  .register-form {
    padding: 20px;
  }
}
</style>
