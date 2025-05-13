<template>
  <hr>
  <footer class="footer mt-5">
    <div class="container">
      <div class="mid-footer row">
        <div class="footer-left col-xs-12 col-md-4 col-lg-5">
          <router-link to="/" class="logo" title="Logo">
            <img
              width="88"
              height="37"
              src="https://inkythuatso.com/uploads/thumbnails/800/2021/10/google-logo-inkythuatso-2-01-29-16-16-57.jpg"
              alt="Hang Thể Thao"
            />
          </router-link>
        </div>
        <div class="col-xs-12 col-md-8 col-lg-7">
          <div class="row">
            <div class="col-xs-12 col-md-4 col-lg-4">
              <div class="widget">
                <h4 class="widget-title">Thông tin</h4>
                <ul>
                  <li><router-link to="/gioi-thieu">Giới thịệu</router-link></li>
                  <li><router-link to="/tuyen-dung">Tuyển dụng</router-link></li>
                  <li><router-link to="/chinh-sach-bao-mat">Chính sách bảo mật</router-link></li>
                  <li><router-link to="/chinh-sach-giao-hang">Chính sách giao hàng</router-link></li>
                </ul>
              </div>
            </div>
            </div>
        </div>
        
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  mounted() {
    this.initSlider();
    window.addEventListener("resize", this.updateSlidesToShow);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateSlidesToShow);
  },
  methods: {
    initSlider() {
      this.sliderContainers = document.querySelectorAll(".slider-container");
      this.sliderContainers.forEach((container) => {
        const prevButton = container.querySelector(".slider-button-prev");
        const nextButton = container.querySelector(".slider-button-next");
        const sliderWrapper = container.querySelector(".slider-wrapper");
        const slides = container.querySelectorAll(".slider-slide");
        this.slideWidth =
          slides[0].getBoundingClientRect().width +
          parseInt(window.getComputedStyle(slides[0]).marginRight);
        this.totalSlides = slides.length;
        this.slidesToShow = 4;
        this.currentIndex = 0;

        this.updateSlidesToShow();

        nextButton.addEventListener("click", this.nextSlide);
        prevButton.addEventListener("click", this.prevSlide);
      });
    },
    nextSlide() {
      if (this.currentIndex < this.totalSlides - this.slidesToShow) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
      this.updateSliderPosition();
    },
    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.totalSlides - this.slidesToShow;
      }
      this.updateSliderPosition();
    },
    updateSlidesToShow() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 576) {
        this.slidesToShow = 1;
      } else if (screenWidth < 768) {
        this.slidesToShow = 2;
      } else if (screenWidth < 992) {
        this.slidesToShow = 3;
      } else {
        this.slidesToShow = 4;
      }
      this.updateSliderPosition();
    },
    updateSliderPosition() {
      const offset = -this.currentIndex * this.slideWidth;
      this.sliderContainers.forEach((container) => {
        container.querySelector(".slider-wrapper").style.transform = `translateX(${offset}px)`;
      });
    },
  },
};
</script>

<style scoped>
.footer {
  margin-top: 5rem;
  background-color: #ffffff;
  color: #fff;
  padding: 2rem 0;
}

.footer .logo img {
  width: 88px;
  height: 37px;
}

.footer .footer-contact i {
  margin-right: 10px;
}

.footer .ul_menu_fot li {
  list-style: none;
  margin-bottom: 5px;
}

.footer .ul_menu_fot li a {
  color: #000000;
  text-decoration: none;
}

.footer .ul_menu_fot li a:hover {
  text-decoration: underline;
}
</style>
