<template>
  <b-sidebar
    id="add-new-customer-sidebar"
    :visible="isAddNewCustomerSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-customer-sidebar-active', val)"
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
        <h5 class="mb-0">Add New Customer</h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />
      </div>

      <!-- BODY -->
      <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
        <!-- Form -->
        <b-form
          class="p-2"
          @submit.prevent="handleSubmit(onSubmit)"
          @reset.prevent="resetForm"
        >
          <validation-provider
            #default="validationContext"
            name="Email"
            rules="required|email"
          >
            <b-form-group label="Email" label-for="email">
              <b-form-input
                id="email"
                v-model="customerData.email"
                autofocus
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>        
          
            <validation-provider
            #default="validationContext"
            name="Phone Number"
            rules=""
          >
            <b-form-group label="Phone Number" label-for="phone_number">
              <b-form-input
                id="phone_number"
                v-model="customerData.phone_number"
                autofocus
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <validation-provider
            #default="validationContext"
            name="FirstName"
            rules=""
          >
            <b-form-group label="FirstName" label-for="first_name">
              <b-form-input
                id="first_name"
                v-model="customerData.first_name"
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <validation-provider
            #default="validationContext"
            name="LastName"
            rules=""
          >
            <b-form-group label="LastName" label-for="last_name">
              <b-form-input
                id="last_name"
                v-model="customerData.last_name"
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <validation-provider
            #default="validationContext"
            name="Password"
            rules="required"
          >
            <b-form-group label="Password" label-for="password">
              <b-form-input
                id="password"
                v-model="customerData.password"
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Form Actions -->
          <div class="d-flex mt-2">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              Add
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click="hide"
            >
              Cancel
            </b-button>
          </div>
        </b-form>
      </validation-observer>
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
// import countries from '@/@fake-db/data/other/countries'
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
  },
  directives: {
    Ripple,
  },
  model: {
    prop: "isAddNewCustomerSidebarActive",
    event: "update:is-add-new-customer-sidebar-active",
  },
  props: {
    isAddNewCustomerSidebarActive: {
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
      isSupercustomerOptions: [
        { label: "Supercustomer", value: true },
        { label: "Basiccustomer", value: false },
      ],
      roleOptions: [
        { label: "Normal", value: 0 },
        { label: "Admin", value: 1 },
        { label: "Cashier", value: 2 },
        { label: "Stock Keeper", value: 3 },
      ],
    };
  },
  setup(props, { emit }) {
    const blankCustomerData = {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      phone_number: "",
      is_active: true,
      is_staff: false,
      is_supercustomer: false,
      role: 0,
    };

    const customerData = ref(JSON.parse(JSON.stringify(blankCustomerData)));
    const resetcustomerData = () => {
      customerData.value = JSON.parse(JSON.stringify(blankCustomerData));
    };

    const onSubmit = () => {
      store.dispatch("app-customer/addUser", customerData.value).then(() => {
        emit("refetch-data");
        emit("update:is-add-new-customer-sidebar-active", false);
      });
    };

    const { refFormObserver, getValidationState, resetForm } =
      formValidation(resetcustomerData);

    return {
      customerData,
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

#add-new-customer-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
