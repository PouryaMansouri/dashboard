<template>
  <b-sidebar
    id="add-new-category-sidebar"
    :visible="isAddNewCategorySidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-category-sidebar-active', val)"
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
        <h5 class="mb-0">Add New Category</h5>

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
                v-model="categoryData.name"
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
            name="Slug"
            rules="required"
          >
            <b-form-group label="Slug" label-for="slug">
              <b-form-input
                id="slug"
                v-model="categoryData.slug"
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
                v-model="categoryData.description"
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
                v-model="categoryData.is_active"
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
            name="Is Navbar"
            rules=""
          >
            <b-form-group
              label="Is Navbar"
              label-for="is_navbar"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="categoryData.is_navbar"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="isNavbarOptions"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="is_navbar"
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
    prop: "isAddNewCategorySidebarActive",
    event: "update:is-add-new-category-sidebar-active",
  },
  props: {
    isAddNewCategorySidebarActive: {
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
      isDeletedOptions: [
        { label: "Deleted", value: true },
        { label: "NotDeleted", value: false },
      ],
      isNavbarOptions: [
        { label: "Navbar", value: true },
        { label: "NotNavbar", value: false },
      ],
    };
  },
  setup(props, { emit }) {
    const blankCategoryData = {
      name: "",
      slug: "",
      description: "",
      is_active: true,
      is_deleted: false,
      is_navbar: false,
    };

    const categoryData = ref(JSON.parse(JSON.stringify(blankCategoryData)));
    const resetcategoryData = () => {
      categoryData.value = JSON.parse(JSON.stringify(blankCategoryData));
    };

    const onSubmit = () => {
      store.dispatch("app-category/addCategory", categoryData.value).then(() => {
        emit("refetch-data");
        emit("update:is-add-new-category-sidebar-active", false);
      });
    };

    const { refFormObserver, getValidationState, resetForm } =
      formValidation(resetcategoryData);

    return {
      categoryData,
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

#add-new-category-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
