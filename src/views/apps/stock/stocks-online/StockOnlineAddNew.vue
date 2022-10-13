<template>
  <b-sidebar
    id="add-new-stock-sidebar"
    :visible="isAddNewStockSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-ps"
    shadow
    backdrop
    no-header
    right
    @change="(val) => $emit('update:is-add-new-stock-sidebar-active', val)"
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
        <h5 class="mb-0">Online Stock</h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />
      </div>
      <online-stock-form-wizard />
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
import OnlineStockFormWizard from "./OnlineStockFormWizard.vue";

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
    OnlineStockFormWizard,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: "isAddNewStockSidebarActive",
    event: "update:is-add-new-stock-sidebar-active",
  },
  props: {
    isAddNewStockSidebarActive: {
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
