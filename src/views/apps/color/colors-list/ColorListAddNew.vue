<template>
  <b-sidebar
    id="add-new-color-sidebar"
    :visible="isAddNewColorSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-color-sidebar-active', val)"
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
        <h5 class="mb-0">Add New Color</h5>

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
            name="Name"
            rules="required"
          >
            <b-form-group label="Name" label-for="name">
              <b-form-input
                id="name"
                v-model="colorData.name"
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
            name="Code"
            rules="required"
          >
            <b-form-group label="Code" label-for="code">
              <b-form-input
                id="code"
                v-model="colorData.code"
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <b-form-group label="Picker" label-for="picker">
            <picker :value="colorData.code" @input="updateValue" />
          </b-form-group>

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
import { Chrome } from "vue-color";

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
    picker: Chrome,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: "isAddNewColorSidebarActive",
    event: "update:is-add-new-color-sidebar-active",
  },
  props: {
    isAddNewColorSidebarActive: {
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
  setup(props, { emit }) {
    const blankColorData = {
      name: "",
      code: "",
    };

    const colorData = ref(JSON.parse(JSON.stringify(blankColorData)));
    const resetcolorData = () => {
      colorData.value = JSON.parse(JSON.stringify(blankColorData));
    };

    const onSubmit = () => {
      store.dispatch("app-color/addColor", colorData.value).then(() => {
        emit("refetch-data");
        emit("update:is-add-new-color-sidebar-active", false);
      });
    };

    const updateValue = (color) => {
      colorData.value.code = color.hex;
    };

    const { refFormObserver, getValidationState, resetForm } =
      formValidation(resetcolorData);

    return {
      colorData,
      onSubmit,
      refFormObserver,
      getValidationState,
      resetForm,
      updateValue,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

#add-new-color-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
