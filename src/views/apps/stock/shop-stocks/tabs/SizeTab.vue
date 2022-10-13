<template>
  <div>
    <b-row>
      <b-col cols="4">
        <b-input-group class="input-group-merge mb-1">
          <b-form-input @input="searchFilter" placeholder="Search Sizes" />
          <b-input-group-append is-text>
            <feather-icon icon="SearchIcon" class="text-muted" />
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <b-form-group label="All Sizes" label-for="allSizes">
          <b-form-select
            v-model="selected"
            :options="optionSizes"
            :select-size="10"
            @change="selectSize"
          ></b-form-select>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <h4>{{ showSize(selected) }}</h4>
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
  props: ["stock", "sizes"],
  data() {
    return {
      selected: null,
      allOptionSizes: [],
      optionSizes: [],
    };
  },
  computed: {},
  methods: {
    searchFilter(value) {
      const filteredData = this.allOptionSizes.filter((item) =>
        item.text.toLowerCase().includes(value)
      );
      this.optionSizes = filteredData;
    },
    selectSize(value) {
      this.$props.stock.size = value;
    },
    showSize(value) {
      const filteredData = this.optionSizes.filter(
        (item) => item.value == value
      );

      if (filteredData.length != 0) {
        return filteredData[0].text;
      }
      return "";
    },
  },
  async created() {
    this.allOptionSizes = this.sizes;
    this.optionSizes = this.sizes;
  },
};
</script>