<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000';
const cartItems = ref([]);
const discountCode = ref('');
const discountValue = ref(0);
const discountApplied = ref(false);

const subtotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const totalAfterDiscount = computed(() =>
  subtotal.value - discountValue.value
);

const loadCart = async () => {
  const userId = localStorage.getItem('user_id');
  const guestId = localStorage.getItem('guest_id');

  if (!userId && !guestId) {
    console.error('No user_id or guest_id found in localStorage');
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/api/cart`, {
      params: {
        user_id: userId,
        guest_id: guestId
      }
    });

    const cartItemsWithDetails = await Promise.all(response.data.map(async item => {
      const productResponse = await axios.get(`${API_URL}/api/products/${item.product_id}`);
      const productDetails = productResponse.data;
      return {
        ...item,
        name: productDetails.name,
        price: productDetails.price,
        image: productDetails.images[0]?.image_path || ''
      };
    }));

    cartItems.value = cartItemsWithDetails;
  } catch (error) {
    console.error('Error loading cart:', error);
    alert('Có lỗi xảy ra khi tải giỏ hàng');
  }
};


// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateQuantity = async (cartId, newQuantity) => {
  try {
    const response = await axios.post(`${API_URL}/api/cart/update`, {
      cart_id: cartId,
      quantity: newQuantity
    });

    if (response.data.message === 'Quantity updated successfully') {
      loadCart();
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    alert('Có lỗi xảy ra khi cập nhật số lượng');
  }
};

const incrementQty = (index) => {
  const cartItem = cartItems.value[index];
  cartItem.quantity++;
  updateQuantity(cartItem.id, cartItem.quantity);
};

const decrementQty = (index) => {
  const cartItem = cartItems.value[index];
  if (cartItem.quantity > 1) {
    cartItem.quantity--;
    updateQuantity(cartItem.id, cartItem.quantity);
  }
};


const removeItem = async (index) => {
  const userId = localStorage.getItem('user_id');
  const guestId = localStorage.getItem('guest_id');
  const productId = cartItems.value[index].product_id;

  try {
    const response = await axios.post(`${API_URL}/api/cart/remove`, {
      product_id: productId,
      user_id: userId,
      guest_id: guestId
    });

    if (response.data.message === 'Product removed from cart successfully') {
      cartItems.value.splice(index, 1);
      updateCart();
    }
  } catch (error) {
    console.error('Error removing product from cart:', error);
    alert('Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng');
  }
};

//Sử dụng mã giảm giá
const applyDiscount = async () => {
  if (!discountCode.value.trim()) {
    alert('Vui lòng nhập mã giảm giá');
    return;
  }

  const userId = localStorage.getItem('user_id');
  const guestId = localStorage.getItem('guest_id');
  const totalAmount = subtotal.value;

  try {
    const response = await axios.post(`${API_URL}/api/discounts/apply`, {
      code: discountCode.value,
      user_id: userId,
      guest_id: guestId,
      total_amount: totalAmount
    });

    if (response.data.success) {
      discountValue.value = response.data.discount_value;
      discountApplied.value = true;
    } else {
      alert('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }
  } catch (error) {
    console.error('Error applying discount:', error);
    alert('Mã giảm giá đã hết lượt sử dụng hoặc không tồn tại');
  }
};

const updateCart = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
};

const formatVND = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

onMounted(() => {
  loadCart();
});
</script>


<template>
  <!-- Breadcrumb Section -->
  <section class="shop1 text-center">
    <span class="crumb-border"></span>
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <ul class="breadcrumb">
            <li class="home">
              <router-link to="/"><b>Trang chủ </b></router-link>
              <span class="icon-arrow-right text-danger">
                <font-awesome-icon :icon="['fas', 'arrow-right']" />
              </span>
            </li>
            <li><strong><span class="text-danger"> Giỏ Hàng</span></strong></li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Shoping Cart Section -->
  <section class="shoping-cart spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="shoping__cart__table">
            <table>
              <thead>
                <tr>
                  <th class="shoping__product">Sản Phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Số Lượng</th>
                  <th>Size</th>
                  <th>Tổng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in cartItems" :key="item.productId">
                  <td class="shoping__cart__item">
                    <img :src="`${API_URL}/storage/${item.image}`" :alt="item.image" alt="product-image" />
                  </td>
                  <td class="shoping__cart__text">
                    <h5>{{ item.name }}</h5>
                  </td>
                  <td class="shoping__cart__price">
                    {{ formatVND(item.price) ?? '0' }}
                  </td>
                  <td class="shoping__cart__quantity">
                    <div class="quantity mx-auto">
                      <button class="qty-btn decrement" @click="decrementQty(index)">-</button>
                      <input type="text" v-model.number="item.quantity" class="qty-input" />
                      <button class="qty-btn increment" @click="incrementQty(index)">+</button>

                    </div>
                  </td>
                  <td class="shoping__cart__total">{{ item.size }}</td>
                  <td class="shoping__cart__total">
                    {{ formatVND(item.price * item.quantity) ?? '0' }}
                  </td>
                  <td class="shoping__cart__item__close">
                    <span class="icon_clos" @click="removeItem(index)" style="color: red">X</span>
                  </td>
                </tr>
                <tr v-if="cartItems.length === 0">
                  <td colspan="9">Không có sản phẩm trong giỏ hàng</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="shoping__cart__btns">
            <router-link to="/san-pham" class="primary-btn cart-btn">
              TIẾP TỤC MUA SẮM
              <font-awesome-icon :icon="['fas', 'bag-shopping']" />
            </router-link>
          </div>
        </div>
        <div class="col-lg-6">
          <!-- <div class="shoping__continue">
            <div class="shoping__discount">
              <h5>ƯU ĐÃI GIẢM GIÁ</h5>
              <form @submit.prevent="applyDiscount">
                <input type="text" v-model="discountCode" placeholder="Nhập mã giảm giá nếu có" />
                <button type="submit" class="site-btn">
                  ÁP DỤNG
                  <font-awesome-icon :icon="['fas', 'ticket']" />
                </button>
              </form>
              <p v-if="discountApplied">Mã giảm giá đã được áp dụng!</p>
            </div>
          </div> -->
        </div>
        <div class="col-lg-6">
          <div class="shoping__checkout">
            <h5>TỔNG SẢN PHẨM</h5>
            <ul>
              <li>Tạm tính <span>{{ subtotal.toLocaleString('vi-VN') }}đ</span></li>
              <li v-if="discountApplied">Giảm giá <span>{{ discountValue.toLocaleString('vi-VN') }}đ</span></li>
              <li>Tổng thanh toán <span>{{ totalAfterDiscount.toLocaleString('vi-VN') }}đ</span></li>
            </ul>
            <router-link to="/thanh-toan" class="primary-btn">
              TIẾN HÀNH THANH TOÁN
              <font-awesome-icon :icon="['far', 'credit-card']" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>





<style scoped>
/* Styling for quantity controls */
.quantity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  width: 120px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
}

.qty-btn {
  background-color: #f1f1f1;
  border: none;
  width: 40px;
  height: 40px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.qty-btn:hover {
  background-color: #e0e0e0;
}

.qty-input {
  text-align: center;
  width: 40px;
  border: none;
  font-size: 16px;
  outline: none;
  background-color: #fff;
}

/* Table styling */
.shoping__cart__table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.shoping__cart__table th {
  background-color: #f8f9fa;
  color: #333;
  font-weight: bold;
  padding: 15px 10px;
  text-align: left;
  border-bottom: 2px solid #ddd;
}

.shoping__cart__table td {
  padding: 15px 10px;
  vertical-align: middle;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

/* Product image */
.shoping__cart__item img {
  width: 80px;
  height: auto;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Buttons */
.primary-btn {
  display: inline-block;
  background-color: #ff5722;
  color: #fff;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.primary-btn:hover {
  background-color: #e64a19;
}

.cart-btn {
  margin-right: 20px;
}

.site-btn {
  display: inline-block;
  background-color: #388e3c;
  color: #fff;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.site-btn:hover {
  background-color: #2e7d32;
}

/* Totals section */
.shoping__checkout {
  background-color: #f9f9f9;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.shoping__checkout h5 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.shoping__checkout ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.shoping__checkout ul li {
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.shoping__checkout ul li span {
  font-weight: bold;
  color: #ff5722;
}

/* Discount form */
.shoping__discount {
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.shoping__discount h5 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.shoping__discount form input {
  width: 70%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  margin-right: 10px;
}

.shoping__discount form button {
  background-color: #ff5722;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.shoping__discount form button:hover {
  background-color: #e64a19;
}
</style>
