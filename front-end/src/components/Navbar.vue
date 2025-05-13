<template>
  <header class="home-page" style="z-index: 100;">
    <div class="container head-container">
      <!-- Mobile Nav Button -->
      <div class="nav-mobile-button hidden-md hidden-lg" @click="openNav">
        <span class="icon-search-normal-5"><i class="fas fa-bars"></i></span>
      </div>

      <!-- Logo -->
      <a href="/san-pham" class="logo">
        <img src="" alt="">
      </a>

      <!-- Main Navigation Links -->
      <ul class="navmenu">
        <li><router-link to="/san-pham" class="text-black">Sản Phẩm</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin" class="text-green">Admin</router-link></li>
      </ul>

      <!-- Cart and Login/Logout Icons -->
      <ul class="navicon">
        <li>
          <a style="color: #333;" href="/gio-hang">
            <font-awesome-icon :icon="['fas', 'bag-shopping']" />
            <span>{{ cartCount.length > 0 ? cartCount.length : 0 }}</span>
          </a>
        </li>

        <!-- Kiểm tra trạng thái đăng nhập -->
        <li v-if="isLoggedIn" class="dropdown">
          <a href="#" class="dropdown-toggle" style="color: #333;" data-bs-toggle="dropdown" aria-expanded="false">
            <font-awesome-icon :icon="['fas', 'circle-user']" /> {{ username }}
          </a>
          <ul class="dropdown-menu">
            <li><router-link to="/trang-ca-nhan" class="dropdown-item text-black  mx-auto"><font-awesome-icon
                  :icon="['fas', 'address-card']" />Thông tin cá nhân</router-link></li>
            <li><router-link to="/lich-su-mua-hang" class="dropdown-item text-black mx-auto"><font-awesome-icon
                  :icon="['fas', 'clock-rotate-left']" />Lich sử mua hàng</router-link></li>
            <li><button class="dropdown-item text-black mx-auto" style="font-weight: 500;" @click="logout"> <font-awesome-icon
              :icon="['fas', 'right-from-bracket']" /> Đăng xuất</button></li>
          </ul>
        </li>
        <li v-else><router-link to="/login" class="login-button btn-3 text-black">Đăng nhập</router-link></li>
      </ul>
    </div>

    <!-- Mobile Sidenav -->
    <div v-if="isSidenavOpen" id="mySidenav" class="sidenav menu_mobile hidden-md hidden-lg">
      <a href="javascript:void(0)" class="closebtn" @click="closeNav">&times;</a>
      <div class="logo-mb">
        <a href="/" class="logo-wrapper">
          <img src="//bizweb.dktcdn.net/100/483/998/themes/904984/assets/logo.png?1722078914172" width="88" height="37"
            alt="logo">
        </a>
      </div>
      <div class="content_menu_mb">
        <div class="link_list_mobile">
          <ul class="ct-mobile">
            <li><a href="/">Trang Chủ</a></li>
            <li><a href="/san-pham">Sản Phẩm</a></li>
            <li><a href="/blog">Tin tức</a></li>
            <li><a href="/contact">Liên Hệ</a></li>
            <li v-if="isAdmin"><a href="/admin">Admin</a></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>


<script>
import swal from 'sweetalert';

export default {
  data() {
    return {
      isSidenavOpen: false,
      cartCount: localStorage.getItem("cartCount") || "0",
      isAdmin: localStorage.getItem("role") === "admin",
      isLoggedIn: localStorage.getItem("isLogin") === "true", // Đổi thành isLoggedIn
      username: localStorage.getItem("username") || "Khách hàng",
    };
  },
  methods: {
    openNav() {
      this.isSidenavOpen = true;
    },
    closeNav() {
      this.isSidenavOpen = false;
    },
    logout() {
      swal({
        title: "Bạn đã đăng xuất thành công!",
        icon: "success",
        button: "Đóng",
      }).then(() => {
        localStorage.removeItem("isLogin");
        localStorage.removeItem("role");
        this.isLoggedIn = false;
        this.$router.push('/login');
      });
    }
  }
};
</script>


<style scoped>
/* Nút tùy chỉnh */
.btn-custom {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #6a11cb, #2575fc);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Hiệu ứng khi di chuột */
.btn-custom:hover {
  background: linear-gradient(90deg, #2575fc, #6a11cb);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

/* Icon đẹp mắt */
.btn-custom i {
  font-size: 1.2rem;
  margin-right: 0.4rem;
}

/* Điều chỉnh khoảng cách */
.navicon {
  list-style: none;
  margin: 0;
  padding: 0;
}

.navicon li {
  display: inline-block;
  margin-right: 1rem;
}
</style>