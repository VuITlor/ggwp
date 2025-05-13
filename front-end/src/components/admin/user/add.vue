<template>
    <div id="layoutSidenav_content">
      <main>
        <div class="container-fluid px-4" style="margin-top: 80px;">
          <!-- Form thêm người dùng -->
          <h2>Thêm người dùng</h2>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Tên người dùng:</label>
              <input v-model="formData.name" type="text" class="form-control" required placeholder="Nhập tên người dùng" />
            </div>
  
            <div class="mb-3">
              <label class="form-label">Email:</label>
              <input v-model="formData.email" type="email" class="form-control" required placeholder="Nhập email" />
            </div>
  
            <div class="mb-3">
              <label class="form-label">Mật khẩu:</label>
              <input v-model="formData.password" type="password" class="form-control" required placeholder="Nhập mật khẩu" />
            </div>
  
            <div class="mb-3">
              <label class="form-label">Xác nhận mật khẩu:</label>
              <input v-model="formData.password_confirmation" type="password" class="form-control" required placeholder="Xác nhận mật khẩu" />
            </div>
  
            <div class="mb-3">
              <label class="form-label">Quyền người dùng:</label>
              <select v-model="formData.role" class="form-select" required>
                <option value="" disabled>Chọn quyền</option>
                <option v-for="role in roles" :value="role">{{ role }}</option>
              </select>
            </div>
  
            <button type="submit" class="btn btn-primary">Thêm người dùng</button>
          </form>
  
          <div style="height: 10vh"></div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  
  const API_URL = 'http://127.0.0.1:8000';
  const roles = ref(['Admin', 'Manager', 'User']);  // Các quyền có thể chọn
  const formData = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: ''
  });
  
  // Hàm xử lý form submit
  const handleSubmit = async () => {
    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (formData.password !== formData.password_confirmation) {
      Swal.fire({
        icon: 'error',
        title: 'Mật khẩu không khớp!',
        text: 'Vui lòng xác nhận mật khẩu lại.'
      });
      return;
    }
  
    const requestData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };
  
    try {
      await axios.post(`${API_URL}/api/users`, requestData);
      Swal.fire({
        icon: 'success',
        title: 'Thêm người dùng thành công!',
      });
      // Reset form sau khi thêm thành công
      formData.name = '';
      formData.email = '';
      formData.password = '';
      formData.password_confirmation = '';
      formData.role = '';
    } catch (error) {
      console.error('Error creating user:', error.response.data);
      Swal.fire({
        icon: 'error',
        title: 'Đã xảy ra lỗi!',
        text: error.response.data.message || 'Vui lòng kiểm tra lại thông tin!'
      });
    }
  };
  </script>
  