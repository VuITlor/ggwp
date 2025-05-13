import { createRouter, createWebHistory } from 'vue-router';

// Import các component cho các route
import Product from '../components/Product.vue';
import Detail_product from '../components/Detail_product.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Forgot from '@/components/Forgot.vue';
import Cart from '../components/Cart.vue';
import Checkout from '../components/Checkout.vue';
import Profile from '@/components/Profile.vue';
import OrderHistory from '@/components/OrderHistory.vue';
import Success from '@/components/Success.vue';
import ComfirmPass from '@/components/ComfirmPass.vue';

import AdminLayout from '../components/admin/AdminLayout.vue';
import AdminDashboard from '@/components/admin/AdminDashboard.vue';
import AdminProduct from '@/components/admin/AdminProduct.vue';
import AdminAddProduct from '@/components/admin/products/add.vue';
import AdminCategory from '@/components/admin/AdminCategory.vue';
import AdminAddCategory from '@/components/admin/category/add.vue';
import AdminAddUser from '@/components/admin/user/add.vue';
import AdminUser from '@/components/admin/AdminUser.vue';
import AdminAddDiscount from '@/components/admin/discount/add.vue';
import AdminDiscount from '@/components/admin/AdminDiscount.vue';
import AdminOrder from '@/components/admin/AdminOrder.vue';

const routes = [
  { path: '/san-pham', component: Product, meta: { title: 'Sản phẩm' } },
  { path: '/chi-tiet-san-pham/:id', component: Detail_product, meta: { title: 'Chi tiết sản phẩm' } },
  { path: '/lich-su-mua-hang', component: OrderHistory, meta: { title: 'Lịch sử mua hàng' } },
  { path: '/login', component: Login, meta: { title: 'Đăng nhập' }, name: 'login' },
  { path: '/register', component: Register, meta: { title: 'Đăng ký' }, name: 'register' },
  { path: '/quen-mat-khau', component: Forgot, meta: { title: 'Quên mật khẩu' } },
  { path: '/doi-mat-khau', component: ComfirmPass, meta: { title: 'Đổi mật khẩu' } },
  { path: '/gio-hang', component: Cart, meta: { title: 'Giỏ hàng' } },
  { path: '/thanh-toan', component: Checkout, meta: { title: 'Thanh toán' } },
  { path: '/trang-ca-nhan', component: Profile, meta: { title: 'Thông tin cá nhân' } },
  { path: '/thanh-cong', component: Success, meta: { title: 'Thành công' } },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true }, // Thêm meta để kiểm tra quyền admin
    children: [
      { path: '', component: AdminDashboard, meta: { title: 'Admin Dashboard' } },
      { path: 'products', component: AdminProduct, meta: { title: 'Admin Product' } },
      { path: 'products/add', component: AdminAddProduct, meta: { title: 'Admin Add Product' } },
      { path: 'category', component: AdminCategory, meta: { title: 'Admin Category' } },
      { path: 'category/add', component: AdminAddCategory, meta: { title: 'Admin Add Category' } },
      { path: 'user/add', component: AdminAddUser, meta: { title: 'Admin Add User' } },
      { path: 'user', component: AdminUser, meta: { title: 'Admin User' } },
      { path: 'discount', component: AdminDiscount, meta: { title: 'Admin Discount' } },
      { path: '/admin/discount/add', component: AdminAddDiscount, meta: { title: 'Admin Add Discount' } },
      { path: '/admin/order', component: AdminOrder, meta: { title: 'Admin Order' } },
    ],
  }
// ,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Hàm kiểm tra quyền truy cập
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLogin') === 'true';
  const role = localStorage.getItem('role');
  
  document.title = `${to.meta.title}`;

  // Kiểm tra nếu route yêu cầu đăng nhập
  if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      return next('/login');
    } else if (to.meta.requiresAdmin && role !== 'admin') {
      return next('/login');
    }
  }
  
  next(); 
});

export default router;
