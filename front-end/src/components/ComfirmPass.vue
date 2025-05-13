<template>
    <section class="breadcrumb-section">
        <div class="container">
            <ul class="breadcrumb">
                <li>
                    <router-link to="/">Trang chủ</router-link>
                    <span class="breadcrumb-separator">/</span>
                </li>
                <li>Đặt Lại Mật Khẩu</li>
            </ul>
        </div>
    </section>

    <div class="container reset-container">
        <div class="form-wrapper">
            <h3 class="form-title">Đặt Lại Mật Khẩu</h3>
            <form @submit.prevent="resetPassword">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email" placeholder="Nhập email" class="form-input"
                        required />
                </div>
                <div class="form-group">
                    <label for="password">Mật khẩu mới</label>
                    <input type="password" id="password" v-model="password" placeholder="Nhập mật khẩu mới"
                        class="form-input" required />
                </div>
                <div class="form-group">
                    <label for="password_confirmation">Xác nhận mật khẩu mới</label>
                    <input type="password" id="password_confirmation" v-model="password_confirmation"
                        placeholder="Nhập lại mật khẩu mới" class="form-input" required />
                </div>
                <button type="submit" class="form-button">Đặt Lại Mật Khẩu</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const route = useRoute();
const router = useRouter();

const API_URL = 'http://127.0.0.1:8000';

onMounted(() => {
    email.value = route.query.email || '';
});

const resetPassword = async () => {
    try {
        await axios.post(`${API_URL}/api/password/reset`, {
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value,
            token: route.query.token,
        });
        Swal.fire('Thành công', 'Mật khẩu đã được đặt lại thành công!', 'success');
        router.push('/login');
    } catch (error) {
        Swal.fire('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại!', 'error');
    }
};
</script>


<style scoped>
.breadcrumb-section {
    background-color: #f5f5f5;
    padding: 15px 0;
}

.breadcrumb {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;
}

.breadcrumb li {
    margin-right: 5px;
}

.breadcrumb-separator {
    margin: 0 5px;
    color: #999;
}

.reset-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 100px);
}

.form-wrapper {
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.form-title {
    font-size: 20px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
    color: #333;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
    color: #555;
}

.form-input {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 5px;
    transition: border-color 0.2s;
}

.form-input:focus {
    border-color: #007bff;
    outline: none;
}

.form-button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.form-button:hover {
    background-color: #0056b3;
}
</style>

