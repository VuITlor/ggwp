<template>
  <div id="layoutSidenav_nav">
    <nav class="sb-sidenav sb-sidenav-light shadow-sm">
      <div class="sb-sidenav-menu">
        <div class="nav flex-column">
          <!-- Logo -->
          <div class="text-center py-3 border-bottom">
            <router-link to="/admin" class="d-block text-decoration-none">
              <img src="" alt="" style="width: 120px;">
            </router-link>
          </div>

          <!-- Dashboard -->
          <div class="nav-item my-3">
            <router-link class="nav-link d-flex align-items-center" to="/admin">
              <font-awesome-icon :icon="['fas', 'gauge-high']" class="me-2 text-primary" />
              <span>Dashboard</span>
            </router-link>
          </div>

          <!-- Accordion quản lý -->
          <div id="accordionSidebar" class="accordion">

            <!-- Quản lý sản phẩm -->
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseProducts" aria-expanded="false" aria-controls="collapseProducts">
                  <font-awesome-icon :icon="['fas', 'cart-shopping']" class="me-2 text-success" />
                  Quản Lý Sản Phẩm
                </button>
              </h2>
              <div id="collapseProducts" class="accordion-collapse collapse" data-bs-parent="#accordionSidebar">
                <div class="accordion-body">
                  <router-link class="nav-link" to="/admin/products">Danh sách sản phẩm</router-link>
                  <router-link class="nav-link" to="/admin/products/add">Thêm sản phẩm</router-link>
                </div>
              </div>
            </div>

            <!-- Quản lý danh mục -->
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseCategory" aria-expanded="false" aria-controls="collapseCategory">
                  <font-awesome-icon :icon="['fas', 'layer-group']" class="me-2 text-warning" />
                  Quản Lý Danh Mục
                </button>
              </h2>
              <div id="collapseCategory" class="accordion-collapse collapse" data-bs-parent="#accordionSidebar">
                <div class="accordion-body">
                  <router-link class="nav-link" to="/admin/category">Danh sách danh mục</router-link>
                  <router-link class="nav-link" to="/admin/category/add">Thêm danh mục</router-link>
                </div>
              </div>
            </div>

            <!-- Quản lý mã giảm giá -->
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseDiscount" aria-expanded="false" aria-controls="collapseDiscount">
                  <font-awesome-icon :icon="['fas', 'tag']" class="me-2 text-danger" />
                  Quản Lý Mã Giảm Giá
                </button>
              </h2>
              <div id="collapseDiscount" class="accordion-collapse collapse" data-bs-parent="#accordionSidebar">
                <div class="accordion-body">
                  <router-link class="nav-link" to="/admin/discount">Danh sách mã giảm giá</router-link>
                  <router-link class="nav-link" to="/admin/discount/add">Thêm mã giảm giá</router-link>
                </div>
              </div>
            </div>

            <!-- Quản lý đơn hàng-->
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseOrder" aria-expanded="false" aria-controls="collapseOrder">
                  <font-awesome-icon :icon="['fas', 'cart-shopping']" class="me-2 text-info" />
                  Quản Lý Đơn Hàng
                </button>
              </h2>
              <div id="collapseOrder" class="accordion-collapse collapse" data-bs-parent="#accordionSidebar">
                <div class="accordion-body">
                  <router-link class="nav-link" to="/admin/order">Danh sách đơn hàng</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
<style scoped>
.sb-sidenav {
  background-color: #f8f9fa;
  height: 100vh;
  overflow-y: auto;
}

.nav-link {
  color: #333;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #007bff;
  background-color: #e9ecef;
  border-radius: 4px;
}

.accordion-button {
  font-weight: 500;
}
</style>