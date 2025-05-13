<template>
    <section class="shop1 text-center">
        <span class="crumb-border"></span>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <ul class="breadcrumb">
                        <li class="home">
                            <router-link to="/" class="text-primary"><b>Trang chủ </b></router-link>
                            <span class="icon-arrow-right text-danger">
                                <font-awesome-icon :icon="['fas', 'arrow-right']" />
                            </span>
                        </li>
                        <li><strong><span class="text-danger"> Thông Tin Tài Khoản</span></strong></li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-6 col-sm-8">
                <div class="reset-password-form">
                    <h3 class="text-center mb-4">Quên Mật Khẩu</h3>
                    <form @submit.prevent="submitEmail">
                        <div class="form-group mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" v-model="email" placeholder="Nhập email"
                                required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Gửi Liên Kết Đặt Lại Mật Khẩu</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://127.0.0.1:8000';
const email = ref('');

const submitEmail = async () => {
    try {
        const response = await axios.post(`${API_URL}/api/password/forgot`, {
            email: email.value,
        });
        Swal.fire({
            icon: 'success',
            title: 'Thành Công',
            text: 'Liên kết đặt lại mật khẩu đã được gửi!',
        });
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Có lỗi xảy ra. Vui lòng thử lại!',
        });
    }
};
</script>

<style scoped>
.shop1 {
    padding: 20px 0;
    background-color: #f8f9fa;
}

.crumb-border {
    border-top: 1px solid #ddd;
    margin-bottom: 15px;
}

.breadcrumb {
    padding: 10px 0;
    background-color: transparent;
    margin-bottom: 0;
    list-style: none;
    display: flex;
    gap: 5px;
    justify-content: center;
}

.breadcrumb .home {
    font-weight: bold;
    font-size: 1.2rem;
}

.reset-password-form {
    background-color: #fff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
}

h3 {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
}

.form-label {
    font-weight: bold;
    color: #555;
}

.form-control {
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 8px;
}

.form-control:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    border-color: #80bdff;
}

.btn-primary {
    background-color: #007bff;
    border: none;
    font-size: 1rem;
    padding: 10px;
    border-radius: 8px;
    transition: background-color 0.3s;
}

.btn-primary:hover {
    background-color: #0056b3;
}

@media (max-width: 576px) {
    .reset-password-form {
        padding: 20px;
    }

    h3 {
        font-size: 1.5rem;
    }
}
</style>