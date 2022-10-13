<template>
  <b-sidebar
    id="add-new-supplier-sidebar"
    :visible="isAddNewSupplierSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-supplier-sidebar-active', val)"
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
        <h5 class="mb-0">Add New Supplier</h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          supplier="16"
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
            name="Name"
            rules="required"
          >
            <b-form-group label="Name" label-for="name">
              <b-form-input
                id="name"
                v-model="supplierData.name"
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
            name="Supplier Type"
            rules=""
          >
            <b-form-group
              label="Supplier Type"
              label-for="supplier_type"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="supplierData.supplier_type"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="supplierTypeOptions"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="supplier_type"
              />
              <b-form-invalid-feedback
                :state="getValidationState(validationContext)"
              >
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <validation-provider
            #default="validationContext"
            name="Work Type"
            rules=""
          >
            <b-form-group
              label="Work Type"
              label-for="work_type"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="supplierData.work_type"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="workTypeOptions"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="work_type"
              />
              <b-form-invalid-feedback
                :state="getValidationState(validationContext)"
              >
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <validation-provider
            #default="validationContext"
            name="Is Active"
            rules=""
          >
            <b-form-group
              label="Is Active"
              label-for="is_active"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="supplierData.is_active"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="isActiveOptions"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="is_active"
              />
              <b-form-invalid-feedback
                :state="getValidationState(validationContext)"
              >
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <validation-provider
            #default="validationContext"
            name="Address"
            rules=""
          >
            <b-form-group label="Address" label-for="address">
              <b-form-input
                id="address"
                v-model="supplierData.address"
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
            name="Phone"
            rules=""
          >
            <b-form-group label="Phone" label-for="phone">
              <b-form-input
                id="phone"
                v-model="supplierData.phone"
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
            name="Email"
            rules=""
          >
            <b-form-group label="Email" label-for="email">
              <b-form-input
                id="email"
                v-model="supplierData.email"
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
            name="Website"
            rules=""
          >
            <b-form-group label="Website" label-for="website">
              <b-form-input
                id="website"
                v-model="supplierData.website"
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
            name="Description"
            rules=""
          >
            <b-form-group label="Description" label-for="description">
              <b-form-textarea
                id="description"
                v-model="supplierData.description"
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
  BFormTextarea
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { ref } from "@vue/composition-api";
import { required, alphaNum, email } from "@validations";
import formValidation from "@core/comp-functions/forms/form-validation";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
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
    BFormTextarea,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: "isAddNewSupplierSidebarActive",
    event: "update:is-add-new-supplier-sidebar-active",
  },
  props: {
    isAddNewSupplierSidebarActive: {
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
      workTypeOptions: [
        { label: "Provider", value: 1 },
        { label: "Buyer", value: 2 },
        { label: "Distributor", value: 3 },
        { label: "Other", value: 4 },
      ],
      supplierTypeOptions: [
        { label: "Company", value: 1 },
        { label: "Person", value: 2 },
      ],
    };
  },
  setup(props, { emit }) {
    const blankSupplierData = {
      name: "",
      supplier_type: 2,
      work_type: 1,
      address: "",
      phone: "",
      email: "",
      website: "",
      description: "",
      is_active: true,
    };

    const supplierData = ref(JSON.parse(JSON.stringify(blankSupplierData)));
    const resetsupplierData = () => {
      supplierData.value = JSON.parse(JSON.stringify(blankSupplierData));
    };

    const onSubmit = () => {
      store
        .dispatch("app-supplier/addSupplier", supplierData.value)
        .then(() => {
          emit("refetch-data");
          emit("update:is-add-new-supplier-sidebar-active", false);
        });
    };

    const { refFormObserver, getValidationState, resetForm } =
      formValidation(resetsupplierData);

    return {
      supplierData,
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

#add-new-supplier-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
