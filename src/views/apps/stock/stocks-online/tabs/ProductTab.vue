<template>
  <div>
    <b-row>
      <b-col cols="4">
        <b-input-group class="input-group-merge mb-1">
          <b-form-input @input="searchFilter" placeholder="Search Products" />
          <b-input-group-append is-text>
            <feather-icon icon="SearchIcon" class="text-muted" />
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <b-form-group label="All Products" label-for="allProducts">
          <b-form-select
            v-model="selected"
            :options="optionProducts"
            :select-size="10"
            @change="selectProduct"
          ></b-form-select>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <h4>{{ showProduct(selected) }}</h4>
      </b-col>
    </b-row>
  </div>
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
} from "bootstrap-vue";
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
  },
  props: ["stock"],
  data() {
    return {
      selected: null,
      allOptionProducts: [],
      optionProducts: [],
    };
  },
  computed: {},
  methods: {
    searchFilter(value) {
      const filteredData = this.allOptionProducts.filter((item) =>
        item.text.toLowerCase().includes(value)
      );
      this.optionProducts = filteredData;
    },
    selectProduct(value) {
      this.$props.stock.product = value;
    },
    showProduct(value) {
      const filteredData = this.optionProducts.filter(
        (item) => item.value == value
      );

      if (filteredData.length != 0) {
        return filteredData[0].text;
      }
      return "";
    },
  },
  async created() {
    const { data } = await store.dispatch("app-product/fetchProductOptions");

    this.allOptionProducts = data;
    this.optionProducts = data;
  },
};
</script>