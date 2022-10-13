<template>
  <div>
    <b-row>
      <b-col cols="4">
        <b-input-group class="input-group-merge mb-1">
          <b-form-input @input="searchFilter" placeholder="Search Shops" />
          <b-input-group-append is-text>
            <feather-icon icon="SearchIcon" class="text-muted" />
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <b-form-group label="All Shops" label-for="allShops">
          <b-form-select
            v-model="selected"
            :options="optionShops"
            :select-size="10"
            @change="selectShop"
          ></b-form-select>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <h4>{{ showShop(selected) }}</h4>
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
  props: ["stock", "shopId"],
  data() {
    return {
      selected: null,
      allOptionShops: [],
      optionShops: [],
    };
  },
  computed: {},
  methods: {
    searchFilter(value) {
      const filteredData = this.allOptionShops.filter((item) =>
        item.text.toLowerCase().includes(value)
      );
      this.optionShops = filteredData;
    },
    selectShop(value) {
      this.$props.stock.transfer_to_shop = value;
    },
    showShop(value) {
      const filteredData = this.optionShops.filter(
        (item) => item.value == value
      );

      if (filteredData.length != 0) {
        return filteredData[0].text;
      }
      return "";
    },
  },
  async created() {
    const { data } = await store.dispatch("app-shop/fetchOptionShops");
    const filteredData = data.filter((item) => item.value != this.shopId);
    this.allOptionShops = filteredData;
    this.optionShops = filteredData;
  },
};
</script>