<template>
  <b-sidebar
    id="add-new-shop-sidebar"
    :visible="isAddNewShopSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-shop-sidebar-active', val)"
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
        <h5 class="mb-0">Add New Shop</h5>

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
                v-model="shopData.name"
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
                v-model="shopData.slug"
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
            rules="required"
          >
            <b-form-group label="Description" label-for="description">
              <b-form-textarea
                id="description"
                v-model="shopData.description"
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
            name="Owner"
            rules="required"
          >
            <b-form-group label="Owner" label-for="owner">
              <v-select
                v-model="shopData.owner"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="usersOption"
                label="text"
              >
              </v-select>
              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <validation-provider
            #default="validationContext"
            name="Staffs"
            rules=""
          >
            <b-form-group label="Staffs" label-for="staffs">
              <v-select
                v-model="shopData.staffs"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="usersOption"
                label="text"
                multiple
              >
                <template #option="{ text, email }">
                  <feather-icon
                    icon="UserIcon"
                    size="16"
                    class="align-middle"
                  />
                  <span> {{ text }}</span>
                  <feather-icon
                    icon="MailIcon"
                    size="16"
                    class="align-middle ml-50"
                  />
                  <span> {{ email }}</span>
                </template>
              </v-select>
              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <validation-provider
            #default="validationContext"
            name="Address"
            rules="required"
          >
            <b-form-group label="Address" label-for="address">
              <b-form-input
                id="address"
                v-model="shopData.address"
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
            rules="required|numeric"
          >
            <b-form-group label="Phone" label-for="phone">
              <b-form-input
                id="phone"
                v-model="shopData.phone"
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
            rules="required|email"
          >
            <b-form-group label="Email" label-for="email">
              <b-form-input
                id="email"
                v-model="shopData.email"
                autofocus
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
  BFormSelect,
  BFormTextarea,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { ref } from "@vue/composition-api";
import { required, alphaNum, email, numeric } from "@validations";
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
    BFormSelect,
    BFormTextarea,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: "isAddNewShopSidebarActive",
    event: "update:is-add-new-shop-sidebar-active",
  },
  props: {
    isAddNewShopSidebarActive: {
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
      usersOption: [],
    };
  },
  methods: {
    getUsers() {
      store.dispatch("app-user/fetchUsersOption").then((response) => {
        this.usersOption = [...this.usersOption, ...response];
      });
    },
  },
  created() {
    this.getUsers();
  },
  setup(props, { emit }) {
    const blankShopData = {
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      slug: "",
      owner: 0,
    };

    const shopData = ref(JSON.parse(JSON.stringify(blankShopData)));
    const resetshopData = () => {
      shopData.value = JSON.parse(JSON.stringify(blankShopData));
    };

    const onSubmit = () => {
      const { value } = shopData.value.owner;
      const a = shopData.value.staffs;
      const s = a.map((item) => item.value);

      shopData.value.staffs = s;
      shopData.value.owner = value;

      store.dispatch("app-shop/addShop", shopData.value).then(() => {
        emit("refetch-data");
        emit("update:is-add-new-shop-sidebar-active", false);
      });
    };
    const { refFormObserver, getValidationState, resetForm } =
      formValidation(resetshopData);

    return {
      shopData,
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

#add-new-shop-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
