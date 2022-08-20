<template>
  <b-card title="Color">
    <b-card-body>
      <b-row>
        <b-col cols="4">
          <b-input-group class="input-group-merge mb-1">
            <b-form-input @input="searchFilter" placeholder="Search Colors" />
            <b-input-group-append is-text>
              <feather-icon icon="SearchIcon" class="text-muted" />
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="5">
          <b-form-group label="All Colors" label-for="allColors">
            <b-form-select
              v-model="selectedColors"
              :options="this.optionColors"
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
          <b-form-group label="Selected Colors" label-for="allColors">
            <b-form-select
              v-model="selectedCurrentColors"
              :options="this.currentOptionColors"
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
    colorData: {
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
      selectedColors: [],
      selectedCurrentColors: [],
      currentColors: [],
      allOptionColors: [],
      optionColors: [],
      allColors: [],
      currentOptionColors: [],
    };
  },
  computed: {},
  methods: {
    edit() {
      this.spinner = true;
      const items = this.currentOptionColors.map((item) => item.value);
      store
        .dispatch("app-product/editProduct", {
          id: this.productId,
          productData: { color: items },
        })
        .then(() => {
          this.spinner = false;
        });
    },
    searchFilter(value) {
      const filteredData = this.allOptionColors.filter((item) =>
        item.text.toLowerCase().includes(value)
      );
      this.optionColors = filteredData;
    },
    addToSelected() {
      let selected = this.selectedColors.map((select) => {
        return {
          value: select,
        };
      });

      selected = hasInLeft(this.allColors, selected);

      this.allOptionColors = onlyInLeft(this.allOptionColors, selected);
      this.optionColors = this.allOptionColors;

      this.currentOptionColors = [...this.currentOptionColors, ...selected];

      this.selectedColors = [];
    },
    removeFromSelected() {
      let selected = this.selectedCurrentColors.map((select) => {
        return {
          value: select,
        };
      });

      selected = hasInLeft(this.allColors, selected);

      this.currentOptionColors = onlyInLeft(
        this.currentOptionColors,
        selected
      );
      this.optionColors = this.allOptionColors;

      this.optionColors = [...this.optionColors, ...selected];
      this.allOptionColors = this.optionColors;

      this.selectedCurrentColors = [];
    },
  },
  async created() {
    this.currentColors = this.$props.colorData.map((color) => {
      return {
        text: color.name,
        value: color.id,
      };
    });
    this.currentOptionColors = this.currentColors;

    const options = await store.dispatch("app-product/fetchCreateOptions");
    this.allColors = options.colors;

    this.allOptionColors = onlyInLeft(this.allColors, this.currentColors);
    this.optionColors = this.allOptionColors;
  },
};
</script>