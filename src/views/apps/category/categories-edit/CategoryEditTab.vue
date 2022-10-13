<template>
  <div>
    <b-form>
      <b-row>
        <b-col cols="12" md="4">
          <b-form-group label="Name" label-for="name">
            <b-form-input id="name" v-model="categoryData.name" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Slug" label-for="slug">
            <b-form-input id="slug" v-model="categoryData.slug" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Description" label-for="description">
            <b-form-textarea id="description" v-model="categoryData.description" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Is Active" label-for="is_active">
            <v-select
              v-model="categoryData.is_active"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="[
                { label: 'Active', value: true },
                { label: 'InActive', value: false },
              ]"
              :reduce="(val) => val.value"
              :clearable="false"
              input-id="is_active"
            />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <b-form-group label="Is Navbar" label-for="is_navbar">
            <v-select
              v-model="categoryData.is_navbar"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="[
                { label: 'Navbar', value: true },
                { label: 'NotNavbar', value: false },
              ]"
              :reduce="(val) => val.value"
              :clearable="false"
              input-id="is_navbar"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>

    <b-button
      variant="primary"
      class="mb-1 mb-sm-0 mr-0 mr-sm-1"
      :block="$store.getters['app/currentBreakPoint'] === 'xs'"
      @click="onSubmit"
    >
      Save Changes
    </b-button>
  </div>
</template>

<script>
import {
  BButton,
  BMedia,
  BAvatar,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BTable,
  BCard,
  BCardHeader,
  BCardTitle,
  BFormCheckbox,
  BFormTextarea
} from "bootstrap-vue";
import { avatarText } from "@core/utils/filter";
import vSelect from "vue-select";
import { ref } from "@vue/composition-api";
import store from "@/store";
import router from "@/router";

export default {
  components: {
    BButton,
    BMedia,
    BAvatar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    BTable,
    BCard,
    BCardHeader,
    BCardTitle,
    BFormCheckbox,
    vSelect,
    BFormTextarea
  },
  props: {
    categoryData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  setup(props) {
    const refInputEl = ref(null);
    const previewEl = ref(null);

    const onSubmit = () => {
      store
        .dispatch("app-category/editCategory", {
          id: router.currentRoute.params.id,
          categoryData: props.categoryData,
        })
        .then(() => {
          router.push({ name: "apps-categories-list" });
        });
    };

    return {
      avatarText,
      refInputEl,
      previewEl,
      onSubmit,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
