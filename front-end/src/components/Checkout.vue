<template>
  <!-- Breadcrumb Section Begin -->
  <section class="shop1 text-center">
    <span class="crumb-border"></span>
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <ul class="breadcrumb">
            <li class="home">
              <router-link to="/"><b>Trang chủ </b></router-link>
              <span class="icon-arrow-right text-danger"><font-awesome-icon :icon="['fas', 'arrow-right']" /> </span>
            </li>
            <li><strong><span class="text-danger"> Thanh Toán</span></strong></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  <!-- Breadcrumb Section End -->

  <!-- Checkout Section Begin -->
  <section class="checkout spad">
    <div class="container">
      <div class="checkout__form">
        <h4>Thông Tin Thanh Toán</h4>
        <form @submit.prevent="saveNewAddress">

          <div class="row">
            <div class="col-lg-8 col-md-6">
              <!-- Form thêm địa chỉ nếu không có địa chỉ -->
              <div class="row" v-if="!address || address.length === 0">
                <div class="col-lg-12">
                  <div class="form-group">
                    <label for="">Họ tên<span class="text-danger">*</span></label>
                    <input type="text" class="form-control" v-model="newAddress.full_name">
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group">
                    <label for="">Số Điện Thoại<span class="text-danger">*</span></label>
                    <input type="text" class="form-control" v-model="newAddress.phone">
                  </div>
                </div>
                <!-- Các trường khác cho địa chỉ -->
                <div class="col-lg-12">
                  <div class="form-group">
                    <label for="province" class="form-label">Tỉnh/Thành phố:</label>
                    <select class="form-select" id="province" v-model="newAddress.province" @change="onProvinceChange">
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      <option v-for="province in provinces" :key="province.code" :value="province.code">
                        {{ province.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group" v-if="districts.length > 0">
                    <label for="district" class="form-label">Quận/Huyện:</label>
                    <select class="form-select" id="district" v-model="newAddress.district" @change="onDistrictChange"
                      :disabled="!newAddress.province">
                      <option value="">Chọn Quận/Huyện</option>
                      <option v-for="district in districts" :key="district.code" :value="district.code">
                        {{ district.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-lg-12">
                    <div class="form-group" v-if="wards.length > 0">
                      <label for="ward" class="form-label">Xã/Phường:</label>
                      <select class="form-select" id="ward" v-model="newAddress.commune"
                        :disabled="!newAddress.district">
                        <option value="">Chọn Xã/Phường</option>
                        <option v-for="ward in wards" :key="ward.code" :value="ward.code">
                          {{ ward.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group">
                    <label for="hamlet" class="form-label">Thôn/Xóm:</label>
                    <input type="text" class="form-control" id="hamlet" v-model="newAddress.hamlet" required />
                  </div>
                </div>
                <!-- Button để thêm địa chỉ -->
                <div class="col-lg-12">
                  <button type="submit" class="site-btn">Thêm Địa Chỉ</button>
                </div>
              </div>

              <!-- Dropdown để chọn địa chỉ -->
              <div class="row" v-if="address && address.length > 0">
                <div class="col-lg-12">
                  <div class="form-group">
                    <label for="addressSelect">Chọn Địa Chỉ</label>
                    <select id="addressSelect" class="form-select" v-model="selectedAddress"
                      style="padding: 20px 20px;">
                      <option value="">Chọn Địa Chị</option>
                      <option v-for="(addresses, index) in address" :key="index" :value="addresses">
                        {{ addresses.full_name }} - {{ addresses.province }}, {{ addresses.district }}, {{
                          addresses.commune }}, {{ addresses.hamlet }} - {{ addresses.phone }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>


            </div>
            <div class="col-lg-4 col-md-6">
              <div class="checkout__order">
                <h4>ĐƠN HÀNG</h4>
                <div class="checkout__order__products">Sản phẩm <span>Giá tiền</span></div>
                <ul>
                  <li v-for="(product, index) in cartItems" :key="index" class="text-truncate">
                    {{ product.name }} <span>{{ formatVND(product.price) }}</span>
                    <p>{{ product.id }}</p>
                  </li>
                </ul>
                <div class="checkout__order__subtotal">Tạm tính <span>{{ formatVND(subtotal) }}</span></div>
                <div class="checkout__order__total" v-if="discountApplied">Giảm giá <span>{{ formatVND(discountValue)
                }}</span></div>
                <div class="checkout__order__total">Tổng tiền <span>{{ formatVND(totalAfterDiscount) }}</span></div>

                <!-- Thêm ô input cho mã giảm giá -->
                <div class="form-group">
                  <form @submit.prevent="applyDiscount">
                    <label for="discountCode">Ưu đãi giảm giá:</label>
                    <input type="text" class="form-control" v-model="discountCode" placeholder="Nhập mã giảm giá">
                    <button type="submit" class="site-btn mt-2">Áp Dụng <font-awesome-icon
                        :icon="['fas', 'ticket']" /></button>
                  </form>
                </div>
                <div class="checkout__order__total">Tổng thanh toán <span>{{ formatVND(totalAfterDiscount) }}</span>
                </div>

                <div class="checkout__input__checkbox">
                  <label for="cod">
                    Thanh Toán Khi Nhận Hàng
                    <input type="radio" name="payment" id="cod" value="cod" v-model="paymentMethod">
                    <span class="checkmark"></span>
                  </label>
                </div>

                <!-- Nút xác nhận thanh toán -->
                <button type="button" class="site-btn" @click.prevent="confirmPayment">Xác Nhận Thanh Toán</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { getProvinces, getDistricts, getWards } from 'vietnam-provinces';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();
const API_URL = 'http://127.0.0.1:8000';

const cartItems = ref([]);

const selectedAddress = ref(null);
const isAddingNewAddress = ref(false);
const isLoadingAddress = ref(true);
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const newAddress = ref({
  full_name: '',
  phone: '',
  province: '',
  district: '',
  commune: '',
  hamlet: '',
  houseNumber: '',
});
const discountApplied = ref(false);
const discountCode = ref('');
const discountValue = ref(0);
const totalAfterDiscount = computed(() =>
  subtotal.value - discountValue.value
);
const address = ref([]);

const user_id = localStorage.getItem('user_id');

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

const subtotal = computed(() => {
  return cartItems.value.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
});


const selectedProvinceName = computed(() => {
  const province = provinces.value.find((item) => item.code === newAddress.value.province);
  return province ? province.name : '';
});

const selectedDistrictName = computed(() => {
  const district = districts.value.find((item) => item.code === newAddress.value.district);
  return district ? district.name : '';
});

const selectedWardName = computed(() => {
  const ward = wards.value.find((item) => item.code === newAddress.value.commune);
  return ward ? ward.name : '';
});

const onProvinceChange = (event) => {
  const selectedProvince = event.target.value;
  if (selectedProvince) {
    districts.value = getDistricts(selectedProvince);
    newAddress.value.district = '';
    newAddress.value.commune = '';
  } else {
    districts.value = [];
    wards.value = [];
  }
};

const onDistrictChange = (event) => {
  const selectedDistrict = event.target.value;
  if (selectedDistrict) {
    wards.value = getWards(selectedDistrict);
  } else {
    wards.value = [];
  }
};

const loadAddress = async () => {
  isLoadingAddress.value = true;
  try {
    const response = await axios.get(`${API_URL}/api/address/${user_id}`);
    if (response.status === 200 && Array.isArray(response.data)) {
      address.value = response.data.map(item => ({
        id: item.id,
        full_name: item.full_name,
        phone: item.phone,
        province: item.tinh_thanh,
        district: item.quan_huyen,
        commune: item.xa_phuong,
        hamlet: item.thon_xom,
      }));
    } else {
      address.value = [];
    }
  } catch (error) {
    console.error("Error loading address:", error);
    address.value = [];
  } finally {
    isLoadingAddress.value = false;
  }
};


const saveNewAddress = async () => {
  if (newAddress.value.full_name && newAddress.value.phone && newAddress.value.province && newAddress.value.district && newAddress.value.commune && newAddress.value.hamlet) {
    try {
      const response = await axios.post(`${API_URL}/api/address`, {
        full_name: newAddress.value.full_name,
        phone: newAddress.value.phone,
        tinh_thanh: selectedProvinceName.value,
        quan_huyen: selectedDistrictName.value,
        xa_phuong: selectedWardName.value,
        thon_xom: newAddress.value.hamlet,
        user_id: user_id
      });
      if (response.status === 201) {
        alert("Địa chỉ đã được lưu thành công!");
        isAddingNewAddress.value = false;
        await loadAddress();
      } else {
        alert("Có lỗi xảy ra khi lưu địa chỉ!");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Lỗi kết nối với máy chủ!");
    }
  } else {
    alert("Vui lòng điền đầy đủ thông tin!");
  }
};

const paymentMethod = ref(null);

// console.log(cartItems.product.id);

const confirmPayment = async () => {
  console.log("Selected Address:", selectedAddress.value);
  console.log("Total Price:", totalAfterDiscount.value);
  console.log("Payment Method:", paymentMethod.value);

  if (paymentMethod.value === 'cod' && (
    !selectedAddress.value ||
    !selectedAddress.value.full_name ||
    !selectedAddress.value.phone ||
    !selectedAddress.value.province ||
    !selectedAddress.value.district ||
    !selectedAddress.value.commune ||
    !selectedAddress.value.hamlet)) {
    alert("Vui lòng chọn địa chỉ đầy đủ để tiếp tục!");
    return;
  }

  const products = cartItems.value.map(item => ({
    id: item.product_id,
    quantity: item.quantity
  }));

  const orderData = {
    user_id: user_id,
    full_name: selectedAddress.value?.full_name,
    phone: selectedAddress.value?.phone,
    province: selectedAddress.value?.province,
    district: selectedAddress.value?.district,
    commune: selectedAddress.value?.commune,
    hamlet: selectedAddress.value?.hamlet,
    total_price: totalAfterDiscount.value,
    payment_method: paymentMethod.value,
    products: products
  };

  if (paymentMethod.value === 'vnpay' || paymentMethod.value === 'momo') {
    orderData.amount = subtotal.value;
  }

  console.log("Order Data:", orderData);

  try {
    const response = await axios.post(`${API_URL}/api/orders`, orderData);
    console.log("API /orders Response:", response.data);

    if (response.status === 201 && response.data.order) {
      console.log("Order Created:", response.data.order);

      if (paymentMethod.value === 'vnpay') {
        try {
          const paymentResponse = await axios.post(`${API_URL}/api/payment`, {
            amount: totalAfterDiscount.value,
            order_id: response.data.order.id,
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log("API /payment Response:", paymentResponse.data);

          if (paymentResponse.status === 200 && paymentResponse.data.url) {
            const paymentUrl = paymentResponse.data.url;
            window.location.replace(paymentUrl);
          } else {
            console.error("Không có URL thanh toán!");
            alert("Không có URL thanh toán!");
          }
        } catch (error) {
          console.error("Lỗi khi thực hiện thanh toán:", error);
          alert("Có lỗi xảy ra trong quá trình thanh toán.");
        }
      }
      else if (paymentMethod.value === 'momo') {
        try {
          const momoResponse = await axios.post(`${API_URL}/api/momo`, {
            amount: totalAfterDiscount.value,
            order_id: `momo_${response.data.order.id}`,
          });
          console.log("API /momo Response:", momoResponse.data);

          if (momoResponse.status === 200 && momoResponse.data.payUrl) {
            const momoPaymentUrl = momoResponse.data.payUrl;
            window.location.href = momoPaymentUrl;
          } else {
            console.error("Không có URL thanh toán MoMo!");
            alert("Không có URL thanh toán MoMo!");
          }
        } catch (error) {
          console.error("Lỗi khi thực hiện thanh toán MoMo:", error);
          alert("Có lỗi xảy ra trong quá trình thanh toán MoMo.");
        }
      } else if (paymentMethod.value === 'cod') {
        alert("Đơn hàng đã được tạo thành công. Bạn sẽ thanh toán khi nhận hàng.");
        router.push('/thanh-cong?status=00&order_id=' + response.data.order.id);
      }
    } else {
      console.error("Có lỗi xảy ra trong quá trình tạo đơn hàng.");
      alert("Có lỗi xảy ra trong quá trình tạo đơn hàng.");
      router.push('/thanh-cong?status=01&order_id=' + response.data.order.id);
    }
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error.response?.data || error);
    alert("Có lỗi xảy ra trong quá trình thanh toán.");
    router.push('/thanh-cong?status=01&order_id=' + response.data.order.id);
  }
};

const applyDiscount = async () => {
  if (!discountCode.value.trim()) {
    Swal.fire('Lỗi', 'Vui lòng nhập mã giảm giá', 'error');
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
      Swal.fire('Lỗi', 'Mã giảm giá khó hợp lệ hoặc hết hạn', 'error');
    }
  } catch (error) {
    console.error('Error applying discount:', error);
    Swal.fire('Lỗi', 'Mã giảm giá hết lượt sử dụng hoặc không tồn tại', 'error');
  }
};

const formatVND = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

onMounted(() => {
  loadCart();
  provinces.value = getProvinces();
  loadAddress();
});
</script>


<style scoped>
/* General Styles */
body {
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
  color: #212529;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.site-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #ff7f50;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.site-btn:hover {
  background-color: #ff5722;
}

/* Breadcrumb Section */
.shop1 {
  background-color: #007bff;
  padding: 10px 0;
}

.crumb-border {
  height: 2px;
  background: #ff7f50;
  margin: 10px auto;
}

.breadcrumb {
  display: flex;
  justify-content: center;
  list-style: none;
  gap: 10px;
  padding: 0;
}

.breadcrumb li {
  color: #fff;
}

.breadcrumb li b {
  color: #ffeb3b;
}

.icon-arrow-right {
  margin-left: 5px;
}

/* Checkout Section */
.checkout {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.checkout__form h4 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.checkout__order {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
}

.checkout__order h4 {
  font-size: 1.4rem;
  margin-bottom: 15px;
}

.checkout__order__products,
.checkout__order__subtotal,
.checkout__order__total {
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.checkout__order__total {
  font-weight: bold;
  border-bottom: none;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
}

.form-control,
.form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: border-color 0.3s;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  outline: none;
}

.form-check-input {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.card {
  border: none;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card p {
  margin: 5px 0;
}

/* Payment Section */
.checkout__input__checkbox label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkout__input__checkbox img {
  margin-left: auto;
}

.site-btn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
</style>