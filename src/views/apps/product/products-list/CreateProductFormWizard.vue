<template>
  <div>
    <form-wizard
      color="#7367F0"
      :title="null"
      :subtitle="null"
      shape="circle"
      finish-button-text="Submit"
      back-button-text="Previous"
      class="mb-3"
      @on-complete="formSubmitted"
    >
      <tab-content title="Product" :before-change="validationFormProduct">
        <product-tab :productData="productData" />
      </tab-content>

      <tab-content title="Features" :before-change="formFeature">
        <feature-tab :featureData="featureData" />
      </tab-content>

      <tab-content title="Colors" :before-change="formColor">
        <color-tab :colorData="colorData" />
      </tab-content>

      <tab-content title="Sizes" :before-change="createProduct">
        <size-tab :sizeData="sizeData" />
      </tab-content>

      <tab-content title="Image">
        <image-tab :productId="productId" />
      </tab-content>

      <tab-content title="Gallley">
        <gallery-tab :productId="productId" />
      </tab-content>
    </form-wizard>
  </div>
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
import axios from "@axios";
import FeatureTab from "./tabs/FeatureTab.vue";
import ColorTab from "./tabs/ColorTab.vue";
import SizeTab from "./tabs/SizeTab.vue";
import ProductTab from "./tabs/ProductTab.vue";
import ImageTab from "./tabs/ImageTab.vue";
import GalleryTab from "./tabs/GalleryTab.vue";

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
    FeatureTab,
    ProductTab,
    ColorTab,
    SizeTab,
    ImageTab,
    GalleryTab,
  },
  props: {
    isAddNewProductSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      featureData: {
        currentOptionFeatures: [],
        allFeatures: [],
      },
      colorData: {
        currentOptionColors: [],
        allColors: [],
      },
      sizeData: {
        currentOptionSizes: [],
        allSizes: [],
      },
      productData: {
        category: null,
        brand: null,
        tags: "",
        barcode: "",
        slug: "",
        name: "",
        color: [],
        size: [],
        product_features: [],
      },
      productId: null,
      required,
      email,
    };
  },
  computed: {},
  methods: {
    formSubmitted() {
      location.reload();
    },
    validationFormProduct() {
      if (
        this.productData.category != null &&
        this.productData.brand != null &&
        this.productData.tags != "" &&
        this.productData.barcode != "" &&
        this.productData.slug != "" &&
        this.productData.name != ""
      )
        return true;
      return false;
    },
    formFeature() {
      const items = this.featureData.currentOptionFeatures.map(
        (item) => item.value
      );
      this.productData.product_features = items;
      return true;
    },
    formColor() {
      const items = this.colorData.currentOptionColors.map(
        (item) => item.value
      );
      this.productData.color = items;
      return true;
    },
    async createProduct() {
      const items = this.sizeData.currentOptionSizes.map((item) => item.value);
      this.productData.size = items;

      return new Promise((resolve, reject) => {
        axios
          .post("/products-dashboard/products/create/", this.$data.productData)
          .then((response) => {
            if (response.status === 201) {
              this.$data.productId = response.data.id;
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: "Product Created",
                  icon: "EditIcon",
                  variant: "success",
                },
              });
            }
            resolve(response);
          })
          .catch((error) => {
            this.$toast({
              component: ToastificationContent,
              position: "top-left",
              props: {
                title: "Error",
                variant: "danger",
                icon: "AlertOctagonIcon",
                text: error.response.data,
              },
            });
            reject(error);
          });
      });
    },
  },
  async created() {},
  setup() {},
};
</script>
