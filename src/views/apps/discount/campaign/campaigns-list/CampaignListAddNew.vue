<template>
  <b-sidebar
    id="add-new-campaign-sidebar"
    :visible="isAddNewCampaignSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-campaign-sidebar-active', val)"
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
        <h5 class="mb-0">Add New Campaign</h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          campaign="16"
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
            name="Discount Rate"
            rules=""
          >
            <b-form-group label="Discount Rate" label-for="discount_rate">
              <b-form-input
                id="discount_rate"
                v-model="campaignData.discount_rate"
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
            name="Discount Amount"
            rules=""
          >
            <b-form-group label="Discount Amount" label-for="discount_amount">
              <b-form-input
                id="discount_amount"
                v-model="campaignData.discount_amount"
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
                v-model="campaignData.status"
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

          <validation-provider
            #default="validationContext"
            name="Type"
            rules=""
          >
            <b-form-group
              label="Type"
              label-for="discount_type"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="campaignData.discount_type"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="typeOptions"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="discount_type"
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
            name="Applicable"
            rules=""
          >
            <b-form-group
              label="Applicable"
              label-for="applicable_to"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="campaignData.applicable_to"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="applicableOptions"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="applicable_to"
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
            name="Minimum Purchase Amount"
            rules="required"
          >
            <b-form-group
              label="Minimum Purchase Amount"
              label-for="minimum_purchase_amount"
            >
              <b-form-input
                id="minimum_purchase_amount"
                v-model="campaignData.minimum_purchase_amount"
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
    prop: "isAddNewCampaignSidebarActive",
    event: "update:is-add-new-campaign-sidebar-active",
  },
  props: {
    isAddNewCampaignSidebarActive: {
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
        { label: "InActive", value: 2 },
      ],
      applicableOptions: [
        { label: "Product", value: 1 },
        { label: "Category", value: 0 },
      ],
      typeOptions: [
        { label: "Rate", value: 1 },
        { label: "Amount", value: 2 },
      ],
    };
  },
  setup(props, { emit }) {
    const blankCampaignData = {
      minimum_purchase_amount: 0,
      discount_amount: "",
    };

    const campaignData = ref(JSON.parse(JSON.stringify(blankCampaignData)));
    const resetcampaignData = () => {
      campaignData.value = JSON.parse(JSON.stringify(blankCampaignData));
    };

    const onSubmit = () => {
      store
        .dispatch("app-discount/addCampaign", campaignData.value)
        .then(() => {
          emit("refetch-data");
          emit("update:is-add-new-campaign-sidebar-active", false);
        });
    };

    const { refFormObserver, getValidationState, resetForm } =
      formValidation(resetcampaignData);

    return {
      campaignData,
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

#add-new-campaign-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
