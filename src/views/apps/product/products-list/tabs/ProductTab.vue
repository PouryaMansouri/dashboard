<template>
  <b-row>
    <b-col md="6">
      <b-form-group label="name" label-for="name">
        <b-form-input id="name" v-model="productData.name" />
      </b-form-group>
    </b-col>
    <b-col md="6">
      <b-form-group label="slug" label-for="slug">
        <b-form-input id="slug" v-model="productData.slug" />
      </b-form-group>
    </b-col>
    <b-col md="6">
      <b-form-group label="brand" label-for="brand">
        <b-form-select
          v-model="productData.brand"
          :options="brands"
          :state="productData.brand === null ? false : true"
        />
      </b-form-group>
    </b-col>
    <b-col md="6">
      <b-form-group label="category" label-for="category">
        <b-form-select
          v-model="productData.category"
          :options="categories"
          :state="productData.category === null ? false : true"
        />
      </b-form-group>
    </b-col>
    <b-col md="6">
      <b-form-group label="product_type" label-for="product_type">
        <b-form-select
          v-model="productData.product_type"
          :options="productTypeOptions"
        />
      </b-form-group>
    </b-col>
    <b-col md="6">
      <b-form-group label="barcode" label-for="barcode">
        <b-form-input id="barcode" v-model="productData.barcode" />
      </b-form-group>
    </b-col>
    <b-col md="6">
      <b-form-group label="description" label-for="description">
        <b-form-textarea id="description" v-model="productData.description" />
      </b-form-group>
    </b-col>
    <b-col md="6">
      <b-form-group label="tags" label-for="tags">
        <b-form-input id="tags" v-model="productData.tags" />
      </b-form-group>
    </b-col>
  </b-row>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import vSelect from "vue-select";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BFormSelect,
  BButtonGroup,
  BButton,
  BInputGroup,
  BInputGroupAppend,
  BFormTextarea,
} from "bootstrap-vue";
import store from "@/store";

export default {
  components: {
    FormWizard,
    TabContent,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    vSelect,
    BFormInvalidFeedback,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    BFormSelect,
    BButtonGroup,
    BButton,
    BInputGroup,
    BInputGroupAppend,
    BFormTextarea,
  },
  props: {
    productData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      brands: [{ value: null, text: "Nothing Selected" }],
      categories: [{ value: null, text: "Nothing Selected" }],
      productTypeOptions: [
        { value: 0, text: "Normal" },
        { value: 1, text: "New" },
        { value: 2, text: "Hot" }
      ],
    };
  },
  computed: {},
  methods: {},
  async created() {
    const options = await store.dispatch("app-product/fetchFilterOptions", {
      type: "Nothing Selected",
    });

    this.categories = options.categories;
    this.brands = options.brands;
  },
};
</script>
