<template>
  <b-sidebar
    id="add-new-product-sidebar"
    :visible="isAddNewProductSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-ps"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-product-sidebar-active', val)"
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
        <h5 class="mb-0">Add New Product</h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />
      </div>

      <create-product-form-wizard />
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
import { ref } from "@vue/composition-api";
import { required, alphaNum, email } from "@validations";
import formValidation from "@core/comp-functions/forms/form-validation";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import CreateProductFormWizard from "./CreateProductFormWizard.vue";
import store from "@/store";

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
    CreateProductFormWizard,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: "isAddNewProductSidebarActive",
    event: "update:is-add-new-product-sidebar-active",
  },
  props: {
    isAddNewProductSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      required,
      alphaNum,
      email,
      isActiveOptions: [
        { label: "Active", value: true },
        { label: "InActive", value: false },
      ],
      isStaffOptions: [
        { label: "Staff", value: true },
        { label: "NotStaff", value: false },
      ],
      isSuperproductOptions: [
        { label: "Superproduct", value: true },
        { label: "Basicproduct", value: false },
      ],
    };
  },
  setup(props, { emit }) {
    const blankProductData = {
      email: "",
      first_name: null,
      last_name: null,
      password: "",
      is_active: true,
      is_staff: true,
      is_superproduct: false,
    };

    const productData = ref(JSON.parse(JSON.stringify(blankProductData)));
    const resetproductData = () => {
      productData.value = JSON.parse(JSON.stringify(blankProductData));
    };

    const onSubmit = () => {
      store.dispatch("app-product/addProduct", productData.value).then(() => {
        emit("refetch-data");
        emit("update:is-add-new-product-sidebar-active", false);
      });
    };

    const { refFormObserver, getValidationState, resetForm } =
      formValidation(resetproductData);

    return {
      productData,
      onSubmit,

      refFormObserver,
      getValidationState,
      resetForm,
    };
  },
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
