<template>
  <div id="layoutSidenav_content">
    <main>
      <div class="container-fluid px-4" style="margin-top: 80px;">
        <h2>Thêm danh mục</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label">Tên danh mục:</label>
            <input v-model="formData.name" type="text" class="form-control" required placeholder="Nhập tên danh mục" />
          </div>

          <div class="mb-3">
            <label class="form-label">Mô tả danh mục:</label>
            <textarea v-model="formData.description" class="form-control" placeholder="Nhập mô tả danh mục"></textarea>
          </div>

          <button type="submit" class="btn btn-primary">Thêm</button>
        </form>
        <div style="height: 100vh"></div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://127.0.0.1:8000/api';
const formData = reactive({
  name: '',
  description: ''
});

const handleSubmit = async () => {
  try {
    const response = await axios.post(`${API_URL}/categories`, formData);
    console.log(response.data);
    Swal.fire({
      icon: 'success',
      title: 'Thêm danh mục thành công',
      text: 'Danh mục đã được thêm vào'
    });
    formData.name = '';
    formData.description = '';
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Thêm danh mục thất bại',
      text: 'Có lỗi xảy ra khi thêm danh mục.'
    });
  }
};
</script>
