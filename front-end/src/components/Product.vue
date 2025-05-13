<template>
  <section class="shop1 text-center bg-light py-4">

  </section>

  <div id="productDisplay" class="container py-5">
    <div class="row">
      <!-- Lọc danh mục -->
      <div class="col-lg-3 mb-4 category-filter">
        <div class="p-4 bg-white border rounded shadow-sm">
          <h5 class="text-dark mb-3">Danh mục</h5>

          <!-- Danh sách danh mục -->
          <ul class="list-group mb-3">
            <li v-for="category in categories" :key="category.id"
              class="list-group-item d-flex justify-content-between align-items-center"
              :class="{ 'active': selectedCategory === category.id }" @click="selectedCategory = category.id"
              style="cursor: pointer;">
              {{ category.name }}
              <span class="badge bg-primary rounded-pill">{{ category.productCount }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center"
              :class="{ 'active': !selectedCategory }" @click="selectedCategory = ''" style="cursor: pointer;">
              Tất cả danh mục
              <span class="badge bg-secondary rounded-pill">{{ totalProducts }}</span>
            </li>
          </ul>

          <!-- Thanh tìm kiếm -->
          <div class="input-group">
            <input v-model="searchQuery" type="text" class="form-control" placeholder="Tìm kiếm sản phẩm..." />
          </div>
        </div>
      </div>

      <!-- Hiển thị sản phẩm -->
      <div class="col-lg-9">
        <div class="row g-4">
          <div class="container mt-5 mb-5">
            <div class="d-flex justify-content-center row">
              <div class="col-md-10">
                <div v-for="product in paginatedProducts" :key="product.id"
                  class="row p-2 bg-white border rounded mt-2">
                  <!-- Hình ảnh sản phẩm -->
                  <div class="col-md-3 mt-1">
                    <img class="img-fluid img-responsive rounded product-image"
                      :src="`${API_URL}/storage/${getPrimaryImage(product.images)}`" :alt="product.name" />
                  </div>

                  <!-- Thông tin sản phẩm -->
                  <div class="col-md-6 mt-1">
                    <h5>{{ product.name }}</h5>
                    <div class="d-flex flex-row">
                      <div class="ratings mr-2">
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                      </div>

                    </div>
                    <div class="mt-1 mb-1 spec-1">
                      <span v-for="(spec, index) in product.specs" :key="index">
                        {{ spec }}<span v-if="index < product.specs.length - 1" class="dot"></span>
                      </span>
                    </div>
                    <p class="text-justify text-truncate para mb-0">
                      {{ product.description }}
                    </p>
                  </div>

                  <!-- Hành động sản phẩm -->
                  <div class="align-items-center align-content-center col-md-3 border-left mt-1">
                    <div class="d-flex flex-row align-items-center">
                      <h4 class="mr-1">{{ formatPrice(product.price) }}</h4>
                    </div>
                    <div class="d-flex flex-column mt-4">
                      <router-link :to="'/chi-tiet-san-pham/' + product.id" class="btn btn-primary btn-sm">
                        Chi Tiết
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Không có sản phẩm -->
          <div v-if="filteredProducts.length === 0" class="col-12 text-center mt-4">
            <p>Không có sản phẩm phù hợp</p>
          </div>
        </div>

        <!--  phân trang -->
        <div v-if="totalPages > 1" class="pagination mt-4 text-center">
          <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="btn btn-secondary me-2">
            Trước
          </button>
          <span class="mx-3">Trang {{ currentPage }} / {{ totalPages }}</span>
          <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)"
            class="btn btn-secondary ms-2">
            Sau
          </button>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://127.0.0.1:8000";
const products = ref([]);
const categories = ref([]);
const searchQuery = ref("");
const selectedCategory = ref("");
const currentPage = ref(1);
const perPage = 3;
const totalPages = ref(1);

// Format giá tiền
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// Lấy ảnh chính
const getPrimaryImage = (images) => {
  const primaryImage = images.find((image) => image.is_primary === 1);
  return primaryImage ? primaryImage.image_path : "";
};

// Lọc sản phẩm theo tìm kiếm và danh mục
const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory =
      !selectedCategory.value || product.category_id === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

// Get paginated products based on the current page
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;
  return filteredProducts.value.slice(start, end);
});

// Thêm sản phẩm vào giỏ hàng
// const addToCart = (product) => {
//   Swal.fire({
//     icon: "success",
//     title: "Thành công!",
//     text: `Đã thêm "${product.name}" vào giỏ hàng.`,
//     timer: 1500,
//     showConfirmButton: false,
//   });
//   // Logic thêm vào giỏ hàng có thể thêm tại đây
// };

// Tải dữ liệu sản phẩm và danh mục
const loadProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products`);
    products.value = response.data;
    totalPages.value = Math.ceil(filteredProducts.value.length / perPage); // Update total pages
  } catch (error) {
    console.error("Error loading products:", error);
  }
};

const loadCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/categories`);
    categories.value = response.data;
  } catch (error) {
    console.error("Error loading categories:", error);
  }
};

// Change the current page
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(async () => {
  await Promise.all([loadProducts(), loadCategories()]);
});
</script>
<style scoped>
/* Card sản phẩm */
.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

/* Ảnh sản phẩm */
.card-img-wrapper {
  overflow: hidden;
  border-radius: 10px 10px 0 0;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-img-top:hover {
  transform: scale(1.1);
}

/* Badge */
.badge {
  font-size: 0.8rem;
  padding: 0.5em 0.75em;
}

/* Giá sản phẩm */
.product-price {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .card-img-top {
    height: 150px;
  }
}
</style>
