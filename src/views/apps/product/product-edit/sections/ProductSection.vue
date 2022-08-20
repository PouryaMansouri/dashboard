<template>
  <b-card title="Product">
    <b-card-body>
      <b-row>
        <b-col md="6">
          <b-form-group label="name" label-for="name">
            <b-form-input
              @change="nameChange"
              id="name"
              :value="productData.name"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="slug" label-for="slug">
            <b-form-input
              @change="slugChange"
              id="slug"
              :value="productData.slug"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="brand" label-for="brand">
            <b-form-select
              @change="brandChange"
              v-model="productData.brand.id"
              :options="brands"
              :state="productData.brand.id === null ? false : true"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="category" label-for="category">
            <b-form-select
              @change="categoryChange"
              v-model="productData.category.id"
              :options="categories"
              :state="productData.category.id === null ? false : true"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="barcode" label-for="barcode">
            <b-form-input
              @change="barcodeChange"
              id="barcode"
              :value="productData.barcode"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="description" label-for="description">
            <b-form-input
              @change="descriptionChange"
              id="description"
              :value="productData.description"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="tags" label-for="tags">
            <b-form-input
              @change="tagsChange"
              id="tags"
              :value="productData.tags.map((tag) => tag.name).join()"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-card-body>
    <b-card-footer>
      <b-button variant="primary" @click="edit">
        <b-spinner small v-if="spinner" />
        <span class="text-nowrap">Change</span>
      </b-button>
    </b-card-footer>
  </b-card>
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
  BCard,
  BCardBody,
  BCardFooter,
  BSpinner,
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
    BCard,
    BCardBody,
    BCardFooter,
    BSpinner,
  },
  props: {
    productData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      spinner: false,
      brands: [{ value: null, text: "Nothing Selected" }],
      categories: [{ value: null, text: "Nothing Selected" }],
      product: {
        brand: null,
        category: null,
        name: null,
        slug: null,
        tags: null,
        barcode: null,
        description: null,
      },
    };
  },
  computed: {},
  methods: {
    nameChange(value) {
      this.product.name = value;
    },
    slugChange(value) {
      this.product.slug = value;
    },
    brandChange(value) {
      this.product.brand = value;
    },
    categoryChange(value) {
      this.product.category = value;
    },
    tagsChange(value) {
      this.product.tags = value;
    },
    barcodeChange(value) {
      this.product.barcode = value;
    },
    descriptionChange(value) {
      this.product.description = value;
    },
    edit() {
      this.spinner = true;
      const filteredData = Object.keys(this.product)
        .filter((key) => this.product[key] !== null)
        .reduce((cur, key) => {
          return Object.assign(cur, { [key]: this.product[key] });
        }, {});

      store
        .dispatch("app-product/editProduct", {
          id: this.productData.id,
          productData: filteredData,
        })
        .then(() => {
          this.spinner = false;
        });
    },
  },
  async created() {
    const options = await store.dispatch("app-product/fetchFilterOptions", {
      type: "Nothing Selected",
    });

    this.categories = options.categories;
    this.brands = options.brands;
  },
};
</script>
