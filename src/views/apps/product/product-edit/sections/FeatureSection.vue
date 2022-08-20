<template>
  <b-card title="Feature">
    <b-card-body>
      <b-row>
        <b-col cols="4">
          <b-input-group class="input-group-merge mb-1">
            <b-form-input @input="searchFilter" placeholder="Search Features" />
            <b-input-group-append is-text>
              <feather-icon icon="SearchIcon" class="text-muted" />
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="5">
          <b-form-group label="All Features" label-for="allFeatures">
            <b-form-select
              v-model="selectedFeatures"
              :options="this.optionFeatures"
              multiple
              :select-size="10"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col md="2">
          <div class="text-center">
            <b-button-group vertical>
              <b-button @click="addToSelected" variant="success">add</b-button>
              <b-button>reset</b-button>
              <b-button @click="removeFromSelected" variant="danger"
                >remove</b-button
              >
            </b-button-group>
          </div>
        </b-col>
        <b-col md="5">
          <b-form-group label="Selected Features" label-for="allFeatures">
            <b-form-select
              v-model="selectedCurrentFeatures"
              :options="this.currentOptionFeatures"
              multiple
              :select-size="10"
            ></b-form-select>
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
import { ValidationProvider, ValidationObserver } from "vee-validate";
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
import { onlyInLeft, hasInLeft } from "@core/utils/utils";
import store from "@/store";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
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
    featureData: {
      type: Object,
      required: true,
    },
    productId: {
      required: true,
    },
  },
  data() {
    return {
      spinner: false,
      selectedFeatures: [],
      selectedCurrentFeatures: [],
      currentFeatures: [],
      allOptionFeatures: [],
      optionFeatures: [],
      allFeatures: [],
      currentOptionFeatures: [],
    };
  },
  computed: {},
  methods: {
    edit() {
      this.spinner = true;
      const items = this.currentOptionFeatures.map((item) => item.value);
      store
        .dispatch("app-product/editProduct", {
          id: this.productId,
          productData: { product_features: items },
        })
        .then(() => {
          this.spinner = false;
        });
    },
    searchFilter(value) {
      const filteredData = this.allOptionFeatures.filter((item) =>
        item.text.toLowerCase().includes(value)
      );
      this.optionFeatures = filteredData;
    },
    addToSelected() {
      let selected = this.selectedFeatures.map((select) => {
        return {
          value: select,
        };
      });

      selected = hasInLeft(this.allFeatures, selected);

      this.allOptionFeatures = onlyInLeft(this.allOptionFeatures, selected);
      this.optionFeatures = this.allOptionFeatures;

      this.currentOptionFeatures = [...this.currentOptionFeatures, ...selected];

      this.selectedFeatures = [];
    },
    removeFromSelected() {
      let selected = this.selectedCurrentFeatures.map((select) => {
        return {
          value: select,
        };
      });

      selected = hasInLeft(this.allFeatures, selected);

      this.currentOptionFeatures = onlyInLeft(
        this.currentOptionFeatures,
        selected
      );
      this.optionFeatures = this.allOptionFeatures;

      this.optionFeatures = [...this.optionFeatures, ...selected];
      this.allOptionFeatures = this.optionFeatures;

      this.selectedCurrentFeatures = [];
    },
  },
  async created() {
    this.currentFeatures = this.$props.featureData.map((feature) => {
      return {
        text: feature.description,
        value: feature.id,
      };
    });
    this.currentOptionFeatures = this.currentFeatures;

    const options = await store.dispatch("app-product/fetchCreateOptions");
    this.allFeatures = options.features;

    this.allOptionFeatures = onlyInLeft(this.allFeatures, this.currentFeatures);
    this.optionFeatures = this.allOptionFeatures;
  },
};
</script>
