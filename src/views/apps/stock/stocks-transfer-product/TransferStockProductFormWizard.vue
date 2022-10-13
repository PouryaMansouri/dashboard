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
      <tab-content title="To Shop">
        <to-shop-tab :stock="stock" :shopId="shopId" />
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
import TransferTab from "./tabs/TransferTab.vue";
import store from "@/store";
import router from "@/router";

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
    FromShopTab,
    ToShopTab,
    TransferTab,
  },
  props: ["stock", "shopId"],
  data() {
    return {};
  },
  computed: {},
  methods: {
    formSubmitted() {
      store
        .dispatch("app-stock/addStock", this.stock)
        .then((response) => {
          if (response.status == 200) {
            router.push({
              name: "apps-stocks-transfer",
            });
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
  },
  async created() {},
  setup() {},
};
</script>
