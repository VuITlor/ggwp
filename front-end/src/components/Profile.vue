<template>
  <div class="container profile-section" style="height: 60vh;">
    <div class="row mb-5">
      <div class="col-md-3">
        <ul class="list-group">
          <li class="list-group-item" @click="activeTab = 'account'">
            <span><font-awesome-icon icon="circle-user" /> Thông Tin Tài Khoản</span>
          </li>
          <li class="list-group-item" @click="activeTab = 'profile'">
            <span><font-awesome-icon icon="location-dot" /> Địa Chỉ</span>
          </li>
        </ul>
      </div>
      <div class="col-md-9">
        <div class="card">
          <div class="profile-header">
            <h5 class="card-title fw-bold fs-4">{{ activeTab === 'account' ? 'Thông Tin Tài Khoản' : activeTab ===
              'profile' ? 'Thông Tin Địa Chỉ' : 'Đơn Hàng' }}</h5>
          </div>

          <!-- Account Section -->
          <div>
            <!-- Hiển thị thông tin người dùng -->
            <div class="card-body" v-if="activeTab === 'account'">
              <div class="mb-3">
                <label for="username" class="form-label">Tên Người Dùng</label>
                <input type="text" class="form-control" id="username" v-model="profile.username" disabled />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email:</label>
                <input type="email" class="form-control" id="email" v-model="profile.email" disabled />
              </div>
              <button @click="openEditModal" class="btn btn-primary">Chỉnh sửa thông tin</button>
            </div>

            <!-- Modal chỉnh sửa thông tin -->
            <div v-if="showModal" class="modal fade show" tabindex="-1" style="display: block;" aria-hidden="false">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Chỉnh sửa thông tin</h5>
                    <button type="button" class="btn-close" @click="closeEditModal"></button>
                  </div>
                  <div class="modal-body">
                    <div class="mb-3">
                      <label for="editUsername" class="form-label">Tên Người Dùng:</label>
                      <input type="text" class="form-control" id="editUsername" v-model="profile.username" />
                    </div>
                    <div class="mb-3">
                      <label for="editEmail" class="form-label">Email:</label>
                      <input type="email" class="form-control" id="editEmail" v-model="profile.email" disabled />
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeEditModal">Đóng</button>
                    <button type="button" class="btn btn-primary" @click="updateProfile">Lưu thay đổi</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Section (Address) -->
          <div class="card-body" v-if="activeTab === 'profile'">
            <button type="button" class="btn btn-secondary justify-content-end" @click="toggleNewAddressForm">
              Thêm Địa Chỉ Mới <font-awesome-icon :icon="['fas', 'plus']" />
            </button>
            <div v-if="isAddingNewAddress" class="mt-3 border p-3">
              <h5>Thêm Địa Chỉ Mới</h5>
              <div class="row mt-2">
                <div class="col-md-6">
                  <label for="fullName" class="form-label">Họ tên:</label>
                  <input type="text" class="form-control" id="fullName" v-model="newAddress.full_name" />
                </div>
                <div class="col-md-6">
                  <label for="phone" class="form-label">Số điện thoại:</label>
                  <input type="text" class="form-control" id="phone" v-model="newAddress.phone" />
                </div>
              </div>

              <!-- Province, District, Ward Section -->
              <div class="row mt-2">
                <div class="col-md-6">
                  <label for="province" class="form-label">Tỉnh/Thành phố:</label>
                  <select class="form-select" id="province" v-model="newAddress.province" @change="onProvinceChange">
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    <option v-for="province in provinces" :key="province.code" :value="province.code">
                      {{ province.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="district" class="form-label">Quận/Huyện:</label>
                  <select class="form-select" id="district" v-model="newAddress.district" @change="onDistrictChange"
                    :disabled="!newAddress.province">
                    <option value="">Chọn Quận/Huyện</option>
                    <option v-for="district in districts" :key="district.code" :value="district.code">
                      {{ district.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="row mt-2">
                <div class="col-md-6">
                  <label for="ward" class="form-label">Xã/Phường:</label>
                  <select class="form-select" id="ward" v-model="newAddress.commune" :disabled="!newAddress.district">
                    <option value="">Chọn Xã/Phường</option>
                    <option v-for="ward in wards" :key="ward.code" :value="ward.code">
                      {{ ward.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="hamlet" class="form-label">Thôn/Xóm:</label>
                  <input type="text" class="form-control" id="hamlet" v-model="newAddress.hamlet" required />
                </div>
              </div>
              <button type="button" class="btn btn-primary mt-3" @click="saveNewAddress" :disabled="!isFormValid">
                <i class="bi bi-floppy"></i> Lưu Địa Chỉ
              </button>
            </div>

            <table class="table mt-3 table-bordered">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ tên</th>
                  <th>Số điện thoại</th>
                  <th>Tỉnh/Thành phố</th>
                  <th>Quận/Huyện</th>
                  <th>Xã/Phường</th>
                  <th>Thôn/Xóm</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(addresses, index) in address" :key="addresses.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ addresses.full_name }}</td>
                  <td>{{ addresses.phone }}</td>
                  <td>{{ addresses.tinh_thanh }}</td>
                  <td>{{ addresses.quan_huyen }}</td>
                  <td>{{ addresses.xa_phuong }}</td>
                  <td>{{ addresses.thon_xom }}</td>
                  <td>
                    <button class="btn btn-primary" @click="editAddress(addresses)">
                      <font-awesome-icon :icon="['fas', 'pen-to-square']" />
                    </button>
                    <button class="btn btn-danger" @click="deleteAddress(addresses.id)">
                      <font-awesome-icon :icon="['far', 'trash-can']" />
                    </button>
                  </td>
                </tr>
                <tr v-if="address.length === 0" class="text-center">
                  <td colspan="8">Không có địa chỉ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getProvinces, getDistricts, getWards } from 'vietnam-provinces';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://127.0.0.1:8000';
const user_id = localStorage.getItem('user_id');
const activeTab = ref('account');
const showModal = ref(false);
const profile = ref({
  username: '',
  email: '',
  name: '',
  phone: ''
});

const fetchProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    profile.value = response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    alert('Có lỗi xảy ra khi tải thông tin người dùng.');
  }
};

const validateProfile = () => {
  if (!profile.value.username.trim()) {
    Swal.fire('Lỗi', 'Tên người dùng không được để trống!', 'error');
    return false;
  }
  const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/; // Tên đăng nhập chỉ chứa chữ, số, dấu chấm, gạch dưới, và dài ít nhất 3 ký tự
  if (!usernameRegex.test(profile.value.username)) {
    Swal.fire('Lỗi', 'Tên người dùng không hợp lệ (ít nhất 3 ký tự, không chứa ký tự đặc biệt)!', 'error');
    return false;
  }
  if (!profile.value.email.trim()) {
    Swal.fire('Lỗi', 'Email không được để trống!', 'error');
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(profile.value.email)) {
    Swal.fire('Lỗi', 'Địa chỉ email không hợp lệ!', 'error');
    return false;
  }
  return true;
};


const updateProfile = async () => {
  if (!validateProfile()) {
    return;
  }

  try {
    const response = await axios.put(
      `${API_URL}/api/user/profile`,
      {
        username: profile.value.username,
        email: profile.value.email,
        name: profile.value.name,
        phone: profile.value.phone
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    profile.value = response.data;
    Swal.fire('Thành công', 'Cập nhật thông tin thành công', 'success');
  } catch (error) {
    console.error('Error updating profile:', error);
    Swal.fire('Lỗi', 'Đã có lỗi xảy ra khi cập nhật thông tin', 'error');
  }
};

const openEditModal = () => {
  showModal.value = true;
};

const closeEditModal = () => {
  showModal.value = false;
};


const isAddingNewAddress = ref(false);
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

const address = ref([]);

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

const toggleNewAddressForm = () => {
  isAddingNewAddress.value = !isAddingNewAddress.value;
};

const loadAddress = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/address/${user_id}`);
    if (response.status === 200) {
      address.value = response.data;
    }
  } catch (error) {
    console.error("Error loading address:", error);
  }
}

const deleteAddress = async (id) => {
  const result = await Swal.fire({
    title: 'Xác nhận xóa?',
    text: "Không thể hoàn tác sau khi xóa!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.delete(`${API_URL}/api/address/${id}`);
      if (response.status === 200) {
        loadAddress();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  }
}

const saveNewAddress = async () => {
  if (newAddress.value.full_name && newAddress.value.phone && newAddress.value.province && newAddress.value.district && newAddress.value.commune && newAddress.value.hamlet) {
    try {
      const response = await axios.post(`${API_URL}/api/address`, {
        full_name: newAddress.value.full_name,
        phone: newAddress.value.phone,
        tinh_thanh: selectedProvinceName.value, // Tên của tỉnh thành
        quan_huyen: selectedDistrictName.value, // Tên của quận huyện
        xa_phuong: selectedWardName.value, // Tên của xã phường
        thon_xom: newAddress.value.hamlet,
        user_id: user_id
      });
      if (response.status === 201) {
        alert("Địa chỉ đã được lưu thành công!");
        isAddingNewAddress.value = false;
        loadAddress();
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

const isFormValid = computed(() => {
  return newAddress.value.full_name && newAddress.value.phone && newAddress.value.province && newAddress.value.district && newAddress.value.commune && newAddress.value.hamlet;
});


onMounted(() => {
  provinces.value = getProvinces();
  loadAddress();
  fetchProfile();
});
</script>

