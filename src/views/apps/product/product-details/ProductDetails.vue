<template>
  <section class="app-ecommerce-details">
    <b-alert variant="danger" :show="product === undefined">
      <h4 class="alert-heading">Error fetching product data</h4>
      <div class="alert-body">
        No item found with this item id. Check
        <b-link class="alert-link" :to="{ name: 'apps-product-details' }">
          Shop
        </b-link>
        for other items.
      </div>
    </b-alert>

    <!-- Content -->
    <b-card v-if="product" no-body>
      <b-card-header>
        <b-button
          variant="primary"
          class="mb-1 mb-sm-0 mr-0 mr-sm-1"
          :to="{ name: 'apps-product-edit', params: { id: product.id } }"
        >
          Edit
        </b-button>
        <b-button
          class="mb-1 mb-sm-0 mr-0 mr-sm-1"
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          v-b-modal.modal-register-stock-form-wizard
          variant="outline-primary"
        >
          Stock register
        </b-button>
        <b-button
          variant="primary"
          class="mb-1 mb-sm-0 mr-0 mr-sm-1"
          @click="deleteProduct(product.id)"
        >
          Delete
        </b-button>
      </b-card-header>
      <b-card-body>
        <b-row class="my-2">
          <b-col
            cols="12"
            md="5"
            class="
              d-flex
              align-items-center
              justify-content-center
              mb-2 mb-md-0
            "
          >
            <swiper
              class="swiper-navigations"
              :options="swiperOptions"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            >
              <swiper-slide v-for="(data, index) in swiperData" :key="index">
                <b-img :src="data.image" fluid />
              </swiper-slide>

              <!-- Add Arrows -->
              <div slot="button-next" class="swiper-button-next" />
              <div slot="button-prev" class="swiper-button-prev" />
            </swiper>
          </b-col>

          <b-col cols="12" md="7">
            <h4>{{ product.name }}</h4>
            <b-card-text class="item-company mb-0">
              <span>Brand: </span>
              <b-link class="company-name">
                {{ product.brand.name }}
              </b-link>
            </b-card-text>
            <div class="ecommerce-details-price d-flex flex-wrap mt-1">
              <h4 class="item-price mr-1">
                {{ showStatus(product.status) }}
              </h4>
              <ul class="unstyled-list list-inline pl-1 border-left">
                <li
                  v-for="star in 5"
                  :key="star"
                  class="ratings-list-item mr-25"
                >
                  <feather-icon
                    icon="StarIcon"
                    size="18"
                    :class="[
                      { 'fill-current': star <= product.star },
                      star <= product.star ? 'text-warning' : 'text-muted',
                    ]"
                  />
                </li>
              </ul>
            </div>
            <b-card-text
              >{{ product.available ? "Available" : "Not Available" }}
            </b-card-text>
            <h6>Category:</h6>
            <b-card-text>
              {{ product.category.name }}
            </b-card-text>
            <hr />

            <h6>Description</h6>
            <b-card-text>{{ product.description }}</b-card-text>
            <hr />

            <div class="product-color-options">
              <h6>Colors</h6>
              <ul class="list-unstyled mb-0">
                <li
                  v-for="color in product.color"
                  :key="color.name"
                  class="d-inline-block"
                >
                  <div v-b-tooltip.hover.top="color.name" class="color-option">
                    <div
                      class="filloption"
                      :style="'background-color:' + color.code + ';'"
                    />
                  </div>
                </li>
              </ul>
            </div>
            <hr />

            <div class="product-color-options">
              <h6>Sizes</h6>
              <ul class="list-unstyled mb-0">
                <li
                  v-for="size in product.size"
                  :key="size.name"
                  class="d-inline-block"
                >
                  <div class="color-option">
                    {{ size.name }}
                  </div>
                </li>
              </ul>
            </div>
            <hr />
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
    <b-row>
      <b-col cols="12">
        <b-card title="Shops And Stocks">
          <product-stocks :productId="productId" />
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <b-card title="Comments">
          <comments-list-product :productId="productId" />
        </b-card>
      </b-col>
    </b-row>
    <b-modal
      hide-footer
      id="modal-register-stock-form-wizard"
      scrollable
      title="Register"
      size="lg"
      cancel-variant="outline-secondary"
    >
      <register-stock-form-wizard-product :productId="productId" />
    </b-modal>
  </section>
</template>

<script>
import { useRouter } from "@core/utils/utils";
import store from "@/store";
import { ref } from "@vue/composition-api";
import {
  BCard,
  BCardBody,
  BRow,
  BCol,
  BImg,
  BCardText,
  BLink,
  BButton,
  BDropdown,
  BDropdownItem,
  BAlert,
  BBadge,
  BCardHeader,
  VBTooltip,
  BModal,
  VBModal,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { useProductUi } from "../useProduct";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import router from "@/router";
import CommentsListProduct from "@views/apps/comment/comments-list/CommentsListProduct.vue";
import RegisterStockFormWizardProduct from "@views/apps/stock/stocks-list/RegisterStockFormWizardProduct.vue";
import ProductStocks from "@views/apps/stock/product-stocks/ProductStocks.vue";

export default {
  directives: {
    Ripple,
    "b-tooltip": VBTooltip,
    "b-modal": VBModal,
  },
  components: {
    BModal,
    // BSV
    BCard,
    BCardBody,
    BRow,
    BCol,
    BImg,
    BCardText,
    BLink,
    BButton,
    BDropdown,
    BDropdownItem,
    BAlert,
    BBadge,
    BCardHeader,
    Swiper,
    SwiperSlide,
    CommentsListProduct,
    RegisterStockFormWizardProduct,
    ProductStocks,
  },
  methods: {
    showStatus(num) {
      if (typeof num !== "number") return num;
      switch (num) {
        case 0:
          return "DRAFT";
        case 1:
          return "PUBLISHED";
        case 2:
          return "DELETED";
      }
    },
    deleteProduct(id) {
      this.$swal({
        title: "Accept Or Deny",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Remove",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          store
            .dispatch("app-product/deleteProduct", { id })
            .then((response) => {
              if (response.status == 204) {
                this.$swal({
                  icon: "success",
                  text: "Deleted",
                  confirmButtonText: "OK",
                  customClass: {
                    confirmButton: "btn btn-primary",
                  },
                });
                router.push({ name: "apps-products-list" });
              } else {
                this.$toast({
                  component: ToastificationContent,
                  position: "top-right",
                  props: {
                    title: "Error",
                    variant: "danger",
                    text: "Error",
                  },
                });
              }
            });
        }
      });
    },
  },
  data() {
    return {
      /* eslint-disable global-require */

      /* eslint-disable global-require */

      swiperOptions: {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
    };
  },
  setup() {
    const { handleCartActionClick, toggleProductInWishlist } = useProductUi();
    const { route } = useRouter();
    const productId = route.value.params.id;

    const swiperData = [];

    const swiperOption = {
      slidesPerView: 3,
      slidesPerColumn: 2,
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
      },
    };

    const product = ref(null);
    const gallery = ref([]);

    const fetchProduct = () => {
      store
        .dispatch("app-product/fetchProduct", { productId })
        .then((response) => {
          product.value = response.data;
          if (response.data.image)
            swiperData.push({ image: response.data.image });
        })
        .catch((error) => {
          if (error.response.status === 404) {
            product.value = undefined;
          }
        });
    };

    const fetchProductGallery = () => {
      store
        .dispatch("app-product/fetchProductGallery", { productId })
        .then((response) => {
          gallery.value = response.data;
          response.data.forEach((element) => {
            swiperData.push({ image: element.image });
          });
        })
        .catch((error) => {
          if (error.response.status === 404) {
            gallery.value = [];
          }
        });
    };

    const selectedColor = ref(null);

    fetchProduct();
    fetchProductGallery();

    return {
      productId,
      // Fetched Product
      product,
      gallery,
      swiperOption,
      swiperData,

      // UI
      selectedColor,
      handleCartActionClick,
      toggleProductInWishlist,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@core/scss/base/pages/app-ecommerce-details.scss";
@import "@core/scss/vue/libs/swiper.scss";

// .swiper {
//   ::v-deep .swiper-wrapper {
//     flex-direction: row !important;
//   }
//   .swiper-slide {
//     margin-top: 30px;
//   }
// }
</style>
