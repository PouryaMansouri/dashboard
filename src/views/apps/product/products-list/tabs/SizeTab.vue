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
      <b-col md="5">
        <b-form-group label="All Sizes" label-for="allSizes">
          <b-form-select
            v-model="selectedSizes"
            :options="this.optionSizes"
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
        <b-form-group label="Selected Sizes" label-for="allSizes">
          <b-form-select
            v-model="selectedCurrentSizes"
            :options="this.$props.sizeData.currentOptionSizes"
            multiple
            :select-size="10"
          ></b-form-select>
        </b-form-group>
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
  },
  props: {
    sizeData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedSizes: [],
      selectedCurrentSizes: [],
      currentSizes: [],
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
    addToSelected() {
      let selected = this.selectedSizes.map((select) => {
        return {
          value: select,
        };
      });

      selected = hasInLeft(this.$props.sizeData.allSizes, selected);

      this.allOptionSizes = onlyInLeft(this.allOptionSizes, selected);
      this.optionSizes = this.allOptionSizes;

      this.$props.sizeData.currentOptionSizes = [
        ...this.$props.sizeData.currentOptionSizes,
        ...selected,
      ];

      this.selectedSizes = [];
    },
    removeFromSelected() {
      let selected = this.selectedCurrentSizes.map((select) => {
        return {
          value: select,
        };
      });

      selected = hasInLeft(this.$props.sizeData.allSizes, selected);

      this.$props.sizeData.currentOptionSizes = onlyInLeft(
        this.$props.sizeData.currentOptionSizes,
        selected
      );
      this.optionSizes = this.allOptionSizes;

      this.optionSizes = [...this.optionSizes, ...selected];
      this.allOptionSizes = this.optionSizes;

      this.selectedCurrentSizes = [];
    },
  },
  async created() {
    const options = await store.dispatch("app-product/fetchCreateOptions");
    this.$props.sizeData.allSizes = options.sizes;

    this.allOptionSizes = onlyInLeft(
      this.$props.sizeData.allSizes,
      this.currentSizes
    );
    this.optionSizes = this.allOptionSizes;
  },
};
</script>
