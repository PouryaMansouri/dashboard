<template>
  <b-sidebar
    id="add-new-stock-transfer-sidebar"
    :visible="isAddNewStockTransferSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-ps"
    shadow
    backdrop
    no-header
    right
    @change="(val) => $emit('update:is-add-new-stock-transfer-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div
        class="
          d-flex
          justify-content-between
          align-items-center
          content-sidebar-header
          px-2
          py-1
        "
      >
        <h5 class="mb-0">Transfer Stock</h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />
      </div>
      <transfer-stock-form-wizard />
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButton,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, alphaNum, email } from "@validations";
import formValidation from "@core/comp-functions/forms/form-validation";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import TransferStockFormWizard from "./TransferStockFormWizard.vue";

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    vSelect,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
    TransferStockFormWizard,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: "isAddNewStockTransferSidebarActive",
    event: "update:is-add-new-stock-transfer-sidebar-active",
  },
  props: {
    isAddNewStockTransferSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      required,
      alphaNum,
      email,
    };
  },
  setup(props, { emit }) {},
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-wizard.scss";

#add-new-product-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
