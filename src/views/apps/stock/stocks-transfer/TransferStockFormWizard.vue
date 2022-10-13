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
      <tab-content title="Product" :before-change="getProduct">
        <product-tab :stock="stock" />
      </tab-content>

      <tab-content title="Color" :before-change="colorCheck">
        <color-tab
          :key="JSON.stringify(colors)"
          :stock="stock"
          :colors="colors"
        />
      </tab-content>

      <tab-content title="Size" :before-change="sizeCheck">
        <size-tab :key="JSON.stringify(sizes)" :stock="stock" :sizes="sizes" />
      </tab-content>

      <tab-content title="From Shop">
        <from-shop-tab :stock="stock" />
      </tab-content>

      <tab-content title="To Shop">
        <to-shop-tab :stock="stock" />
      </tab-content>

      <tab-content title="Transfer Data">
        <transfer-tab :stock="stock" />
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
import FromShopTab from "./tabs/FromShopTab.vue";
import ToShopTab from "./tabs/ToShopTab.vue";
import ColorTab from "./tabs/ColorTab.vue";
import SizeTab from "./tabs/SizeTab.vue";
import ProductTab from "./tabs/ProductTab.vue";
import TransferTab from "./tabs/TransferTab.vue";
import store from "@/store";

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
    ProductTab,
    ColorTab,
    SizeTab,
    FromShopTab,
    ToShopTab,
    TransferTab,
  },
  props: {
    isAddNewStockTransferSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      stock: {
        product: null,
        size: null,
        color: null,
        quantity: null,
        transfer_type: 2,
        transfer_to_shop: null,
        transfer_from_shop: null,
        purchase_price: 0,
        transfer_price: 0,
        transfer_datetime: null,
        transfer_note: "",
      },
      colors: [],
      sizes: [],
      required,
      email,
    };
  },
  computed: {},
  methods: {
    formSubmitted() {
      store
        .dispatch("app-stock/addStock", this.stock)
        .then((response) => {
          if (response.status == 201) {
          }
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
        });
    },
    colorCheck() {
      return this.stock.color ? true : false;
    },
    sizeCheck() {
      return this.stock.size ? true : false;
    },
    async getProduct() {
      if (this.stock.product !== null) {
        return new Promise((resolve, reject) => {
          store
            .dispatch("app-product/fetchProduct", {
              productId: this.stock.product,
            })
            .then((response) => {
              this.colors = response.data.color.map((color) => {
                return {
                  text: color.name,
                  value: color.id,
                };
              });

              this.sizes = response.data.size.map((size) => {
                return {
                  text: size.name,
                  value: size.id,
                };
              });
              resolve(true);
            })
            .catch((error) => {
              if (error.response.status === 404) {
                reject(false);
              }
            });
        });
      } else {
        return false;
      }
    },
  },
  async created() {},
  setup() {},
};
</script>
