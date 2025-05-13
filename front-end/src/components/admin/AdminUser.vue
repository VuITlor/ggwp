<template>
    <div id="layoutSidenav_content">
      <main>
        <div class="container-fluid px-4" style="margin-top: 80px;">
          <h2>Danh sách người dùng</h2>
          
          <!-- Bảng danh sách người dùng -->
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Quyền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <button class="btn btn-warning btn-sm" @click="editUser(user.id)">Sửa</button>
                  <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
  
          <div style="height: 10vh"></div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  
  const API_URL = 'http://127.0.0.1:8000';
  const users = ref([]);
  
  // Hàm lấy danh sách người dùng từ API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      users.value = response.data.data;  // Giả sử dữ liệu trả về có trường 'data' chứa danh sách người dùng
    } catch (error) {
      console.error('Error fetching users:', error.response.data);
      Swal.fire({
        icon: 'error',
        title: 'Không thể lấy danh sách người dùng!',
        text: 'Vui lòng kiểm tra lại kết nối hoặc thử lại sau.'
      });
    }
  };
  
  // Hàm xử lý chỉnh sửa người dùng
  const editUser = (userId) => {
    // Bạn có thể chuyển hướng hoặc mở modal để chỉnh sửa thông tin người dùng
    console.log(`Chỉnh sửa người dùng với ID: ${userId}`);
  };
  
  // Hàm xử lý xóa người dùng
  const deleteUser = async (userId) => {
    const confirmDelete = await Swal.fire({
      icon: 'warning',
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa người dùng này?',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      confirmButtonText: 'Xóa',
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/api/users/${userId}`);
        Swal.fire({
          icon: 'success',
          title: 'Xóa người dùng thành công!',
        });
        // Cập nhật lại danh sách người dùng
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error.response.data);
        Swal.fire({
          icon: 'error',
          title: 'Đã xảy ra lỗi!',
          text: error.response.data.message || 'Không thể xóa người dùng!'
        });
      }
    }
  };
  
  // Lấy danh sách người dùng khi component được mount
  onMounted(fetchUsers);
  </script>
  
  <style scoped>
  /* Bạn có thể thêm CSS để làm đẹp cho bảng hoặc các thành phần trong trang */
  </style>
  