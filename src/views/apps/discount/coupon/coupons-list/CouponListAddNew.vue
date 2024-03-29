<template>
  <b-sidebar
    id="add-new-coupon-sidebar"
    :visible="isAddNewCouponSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-coupon-sidebar-active', val)"
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
        <h5 class="mb-0">Add New Coupon</h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          coupon="16"
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
            name="Code"
            rules="required"
          >
            <b-form-group label="Code" label-for="code">
              <b-form-input
                id="code"
                v-model="couponData.code"
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
            name="Status"
            rules=""
          >
            <b-form-group
              label="Status"
              label-for="status"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="couponData.status"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="statusOptions"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="status"
              />
              <b-form-invalid-feedback
                :state="getValidationState(validationContext)"
              >
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
          <!-- 
          <validation-provider
            #default="validationContext"
            name="Use Limit"
            rules=""
          >
            <b-form-group
              label="Use Limit"
              label-for="use_limit_type"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="couponData.use_limit_type"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="use_limit_typeOptions"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="use_limit_type"
              />
              <b-form-invalid-feedback
                :state="getValidationState(validationContext)"
              >
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider> -->

          <!-- <b-form-group label="Valid From" label-for="valid_from">
            <flat-pickr
              v-model="couponData.constraint.valid_from"
              class="form-control"
              :config="{
                altInput: true,
                altFormat: 'F j, Y',
                enableTime: true,
                dateFormat: 'Y-m-d H:i',
              }"
            />
          </b-form-group>

          <b-form-group label="Valid To" label-for="valid_to">
            <flat-pickr
              v-model="couponData.constraint.valid_to"
              class="form-control"
              :config="{
                altInput: true,
                altFormat: 'F j, Y',
                enableTime: true,
                dateFormat: 'Y-m-d H:i',
              }"
            />
          </b-form-group> -->

          <validation-provider
            #default="validationContext"
            name="Discount Rate"
            rules="numeric"
          >
            <b-form-group label="Discount Rate" label-for="discount_rate">
              <b-form-input
                id="discount_rate"
                v-model="couponData.discount_rate_or_fix_amount"
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
import { required, alphaNum, email, numeric } from "@validations";
import formValidation from "@core/comp-functions/forms/form-validation";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import store from "@/store";
import flatPickr from "vue-flatpickr-component";

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    vSelect,
    ValidationProvider,
    ValidationObserver,
    flatPickr,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: "isAddNewCouponSidebarActive",
    event: "update:is-add-new-coupon-sidebar-active",
  },
  props: {
    isAddNewCouponSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      required,
      alphaNum,
      email,
      numeric,
      statusOptions: [
        { label: "Active", value: 1 },
        { label: "InActive", value: 0 },
      ],
    };
  },
  setup(props, { emit }) {
    const blankCouponData = {
      code: "",
      discount_type: 1,
      discount_rate_or_fix_amount: 0,
      status: 1,
      use_limit_type: 1,
      // constraint: {
      //   valid_from: "",
      //   valid_to: "",
      // },
    };

    const couponData = ref(JSON.parse(JSON.stringify(blankCouponData)));
    const resetcouponData = () => {
      couponData.value = JSON.parse(JSON.stringify(blankCouponData));
    };

    const onSubmit = () => {
      store.dispatch("app-discount/addCoupon", couponData.value).then(() => {
        emit("refetch-data");
        emit("update:is-add-new-coupon-sidebar-active", false);
      });
    };

    const { refFormObserver, getValidationState, resetForm } =
      formValidation(resetcouponData);

    return {
      couponData,
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

#add-new-coupon-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
