<template>
  <b-row>
    <b-col cols="12">
      <product-section :productData="product" />
      <feature-section
        :productId="product.id"
        :featureData="product.product_features"
      />
      <color-section :productId="product.id" :colorData="product.color" />
      <size-section :productId="product.id" :sizeData="product.size" />
      <image-section :productId="product.id" :image="product.image" />
      <gallery-section :productId="product.id" :gallery="gallery" />
    </b-col>
  </b-row>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import vSelect from "vue-select";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BFormSelect,
  BButtonGroup,
  BButton,
  BInputGroup,
  BInputGroupAppend,
} from "bootstrap-vue";
import { required, email } from "@validations";
import FeatureSection from "./sections/FeatureSection.vue";
import ColorSection from "./sections/ColorSection.vue";
import SizeSection from "./sections/SizeSection.vue";
import ProductSection from "./sections/ProductSection.vue";
import ImageSection from "./sections/ImageSection.vue";
import GallerySection from "./sections/GallerySection.vue";
import store from "@/store";
import { ref } from "@vue/composition-api";
import { useRouter } from "@core/utils/utils";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    FormWizard,
    TabContent,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    vSelect,
    BFormInvalidFeedback,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    BFormSelect,
    BButtonGroup,
    BButton,
    BInputGroup,
    BInputGroupAppend,
    FeatureSection,
    ProductSection,
    ColorSection,
    SizeSection,
    ImageSection,
    GallerySection,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
  async created() {},
  setup() {
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
          const filteredData = response.data.map((item) => {
            return {
              ...item,
              fromGallery: true,
            };
          });
          console.log(filteredData);
          gallery.value = filteredData;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            gallery.value = [];
          }
        });
    };
    fetchProduct();
    fetchProductGallery();

    return {
      product,
      gallery,
    };
  },
};
</script>