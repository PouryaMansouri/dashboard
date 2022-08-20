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
            <div class="d-flex align-items-center justify-content-center">
              <b-img
                :src="product.image"
                :alt="`Image of ${product.name}`"
                class="product-img"
                fluid
              />
            </div>
          </b-col>

          <b-col cols="12" md="7">
            <h4>{{ product.name }}</h4>
            <b-card-text class="item-company mb-0">
              <span>by</span>
              <b-link class="company-name">
                {{ product.brand.name }}
              </b-link>
              <b-badge
                pill
                :variant="product.brand.is_active ? 'success' : 'danger'"
                >{{ product.brand.is_active ? "active" : "inactive" }}</b-badge
              >
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
                  :key="color"
                  class="d-inline-block"
                >
                  <div
                    v-b-tooltip.hover.top="color.name"
                    class="color-option"
                  >
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
                  :key="size"
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
        <b-card title="Gallery">
          <b-card-body>
            <swiper
              class="swiper"
              :options="swiperOption"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            >
              <swiper-slide v-for="(data, index) in gallery" :key="index">
                <b-img :src="data.image" fluid />
              </swiper-slide>

              <div slot="pagination" class="swiper-pagination" />
            </swiper>
          </b-card-body>
        </b-card> </b-col
    ></b-row>
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
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { useProductUi } from "../useProduct";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import router from "@/router";

export default {
  directives: {
    Ripple,
    "b-tooltip": VBTooltip,
  },
  components: {
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
  },
  methods: {
    showStatus(num) {
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
      console.log(id);
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
              console.log(response);
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
  setup() {
    const { handleCartActionClick, toggleProductInWishlist } = useProductUi();
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
      const { route } = useRouter();
      const productId = route.value.params.id;

      store
        .dispatch("app-product/fetchProduct", { productId })
        .then((response) => {
          product.value = response.data;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            product.value = undefined;
          }
        });
    };

    const fetchProductGallery = () => {
      const { route } = useRouter();
      const productId = route.value.params.id;

      store
        .dispatch("app-product/fetchProductGallery", { productId })
        .then((response) => {
          gallery.value = response.data;
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
      // Fetched Product
      product,
      gallery,
      swiperOption,

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

.swiper {
  ::v-deep .swiper-wrapper {
    flex-direction: row !important;
  }
  .swiper-slide {
    margin-top: 30px;
  }
}
</style>
