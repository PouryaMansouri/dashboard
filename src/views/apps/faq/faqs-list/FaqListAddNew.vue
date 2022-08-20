<template>
  <b-sidebar
    id="add-new-faq-sidebar"
    :visible="isAddNewFaqSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-faq-sidebar-active', val)"
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
        <h5 class="mb-0">Add New Faq</h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          faq="16"
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
            name="Question"
            rules="required"
          >
            <b-form-group label="Question" label-for="question">
              <b-form-input
                id="question"
                v-model="faqData.question"
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
            name="Answer"
            rules="required"
          >
            <b-form-group label="Answer" label-for="answer">
              <b-form-input
                id="answer"
                v-model="faqData.answer"
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
            name="Is Active"
            rules=""
          >
            <b-form-group
              label="Is Active"
              label-for="is_active"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="faqData.is_active"
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
    prop: "isAddNewFaqSidebarActive",
    event: "update:is-add-new-faq-sidebar-active",
  },
  props: {
    isAddNewFaqSidebarActive: {
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
    };
  },
  setup(props, { emit }) {
    const blankFaqData = {
      question: "",
      answer: "",
    };

    const faqData = ref(JSON.parse(JSON.stringify(blankFaqData)));
    const resetfaqData = () => {
      faqData.value = JSON.parse(JSON.stringify(blankFaqData));
    };

    const onSubmit = () => {
      store.dispatch("app-faq/addFaq", faqData.value).then(() => {
        emit("refetch-data");
        emit("update:is-add-new-faq-sidebar-active", false);
      });
    };

    const { refFormObserver, getValidationState, resetForm } =
      formValidation(resetfaqData);

    return {
      faqData,
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

#add-new-faq-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
