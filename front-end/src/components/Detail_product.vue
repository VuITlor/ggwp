<template>
  <section class="shop1 text-center ">
    <span class="crumb-border"></span>
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <ul class="breadcrumb">
            <li class="home">
              <router-link to="/"><b>Trang chủ </b></router-link>
              <span class="icon-arrow-right text-danger"><font-awesome-icon :icon="['fas', 'arrow-right']" /> </span>
            </li>
            <li class="home">
              <router-link to="/san-pham"><b>Sản Phẩm </b></router-link>
              <span class="icon-arrow-right text-danger"><font-awesome-icon :icon="['fas', 'arrow-right']" /> </span>
            </li>
            <li><strong><span class="text-danger"> {{ product.name }}</span></strong></li>
          </ul>
        </div>
      </div>
    </div>
  </section>


  <section class="product-details ">
    <div class="container mt-5">
      <div class="row">
        <div class="col-lg-6 col-md-6">
          <div class="product__details__pic">
            <div class="product__details__pic__item">
              <img :src="`${API_URL}/storage/${largeImage}`" class="product__details__pic__item--large"
                :alt="product.name">
            </div>
            <div class="product__details__pic__slider">
              <div v-for="image in product.images" :key="image.id" class="thumbnail"
                :style="{ backgroundImage: `url(${API_URL}/storage/${image.image_path})` }"
                @click="changeImage(image.image_path)"></div>
            </div>
          </div>
        </div>

        <div class="col-lg-6 col-md-6">
          <div class="product__details__text">
            <h3>{{ product.name }}</h3>
            <div class="swatch clearfix mb-3">
              <div class="mb-3"><strong>Hãng: </strong><label for="hang_sp">Đang cập nhật</label></div>
              <div class="header"><strong>Size:</strong></div>
              <div class="size-options">
                <label v-for="sku in product.skus" :key="sku.id">
                  <input type="radio" name="size" :value="sku.size" v-model="selectedSize">
                  <span>{{ sku.size }}</span>
                </label>
              </div>
              <div class="mb-3"><strong>Giá sản phẩm: </strong><b><span class="text-danger text-nowrap fs-5">{{
                formatVND(product.price) }}</span></b></div>
            </div>

            <div class="product__details__quantity mb-3">
              <div><strong>Số Lượng:</strong></div>
              <div class="quantity d-flex align-items-center">
                <button class="qty-btn qty-decrease me-2" @click="decreaseQuantity">-</button>
                <input type="text" :value="quantity" class="qty-input text-center" readonly>
                <button class="qty-btn qty-increase ms-2" @click="increaseQuantity">+</button>
              </div>
            </div>
            <div class="product__details__tab">
              <div class="tab-content">
                  <div class="product__details__tab__desc">
                    <div><strong>Mô tả:</strong> {{ product.description }} </div>
                  </div>
                
              </div>
            </div>
            <div class="mb-3">
              <button type="button" @click="addToCart" class="btn btn-danger mt-3">Thêm vào giỏ hàng<font-awesome-icon
                  :icon="['fas', 'cart-plus']" /></button>
            </div>
          </div>
          <div class="col-lg-12">

          </div>
        </div>
      </div>
    </div>
  </section>




  <!-- end -->
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
const selectedTab = ref('tabs-1');
const commentData = ref({
  name: '',
  comment: ''
});
const comments = ref([]);
const selectedSize = ref(null); // Lưu size được chọn

function preiew(tab) {
  selectedTab.value = tab;
}

function submitComment() {
  comments.value.push({
    name: commentData.value.name,
    comment: commentData.value.comment
  });
  commentData.value.name = '';
  commentData.value.comment = '';
}
const route = useRoute();
const relatedProducts = ref([]);
const API_URL = 'http://127.0.0.1:8000';

const product = ref({
  name: '',
  description: '',
  price: '',
  quantity: 0,
  category: null,
  skus: [],
  images: []
});

const largeImage = ref('');
const quantity = ref(1);

// Lấy sản phẩm theo ID
const fetchProduct = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products/${route.params.id}`);
    product.value = response.data;

    // Tìm ảnh chính hoặc ảnh đầu tiên
    const primaryImage = product.value.images.find(image => image.is_primary) || product.value.images[0];
    largeImage.value = primaryImage ? primaryImage.image_path : '';
  } catch (error) {
    console.error('Error fetching product:', error);
  }
};

// Chuyển đổi giá thành VND
const formatVND = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Thay đổi ảnh lớn
const changeImage = (imagePath) => {
  largeImage.value = imagePath;
};

// Quản lý số lượng sản phẩm
const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = async () => {
  let userId = localStorage.getItem('user_id');
  let guestId = localStorage.getItem('guest_id');

  // Nếu cả userId và guestId đều không tồn tại, tạo guestId mới
  if (!userId && !guestId) {
    guestId = 'guest_id' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('guest_id', guestId);
  }

  const payload = {
    product_id: route.params.id,
    quantity: quantity.value,
    size: selectedSize.value
  };

  if (userId) {
    payload.user_id = userId;
  } else {
    payload.guest_id = guestId;
  }

  try {
    const response = await axios.post(`${API_URL}/api/cart/add`, payload);

    if (response.data.message === 'Product added to cart successfully') {
      alert('Sản phẩm đã được thêm vào giỏ hàng');
    }
  } catch (error) {
    console.error('Error adding product to cart:', error);
    alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
  }
};

const fetchRelatedProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products/category/${product.value.category.id}`);
    if (response.status === 200) {
      relatedProducts.value = response.data;
      console.log(relatedProducts.value);
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchProduct();
  fetchComments();
  loadReviews();
  fetchRelatedProducts();
});


</script>

<style scoped>
.product__details__pic__item--large {
  width: 100%;
  height: 600px;
  object-fit: cover;
}

.product__details__pic__slider {
  display: flex;
  justify-content: space-between;
  overflow-x: auto;
  gap: 10px;
}

.product__details__pic__slider .thumbnail {
  width: 150px;
  height: 150px;
  background-size: cover;
  background-position: center;
  object-fit: cover;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.product__details__pic__slider .thumbnail:hover {
  border-color: #f56363;
}

.product__details__quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 30px;
  height: 39px;
  font-size: 18px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.qty-btn:hover {
  background-color: #e0e0e0;
}

.qty-input {
  width: 50px;
  text-align: center;
  margin: 0 5px;
  border: 1px solid #ccc;
  padding: 5px;
  font-size: 16px;
  background-color: #fff;
}

.product-details {
  margin: -65px 0 auto;
}

.size-options {
  display: flex;
  gap: 10px;
}

.size-options label {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.size-options input[type="radio"] {
  display: none;
}

.size-options span {
  display: inline-block;
  padding: 8px 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  transition: all 0.3s ease;
}

.size-options input[type="radio"]:checked+span {
  border-color: #ff0000;
  background-color: #ff0000;
  color: #fff;
}

.tab-content>.tab-pane {
  display: none;
}

.tab-content>.tab-pane.active {
  display: block;
}

.related-products .card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.related-products .card:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
