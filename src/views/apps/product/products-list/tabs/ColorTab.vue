<template>
  <div>
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
            :options="this.$props.colorData.currentOptionColors"
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
    colorData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedColors: [],
      selectedCurrentColors: [],
      currentColors: [],
      allOptionColors: [],
      optionColors: [],
    };
  },
  computed: {},
  methods: {
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

      selected = hasInLeft(this.$props.colorData.allColors, selected);

      this.allOptionColors = onlyInLeft(this.allOptionColors, selected);
      this.optionColors = this.allOptionColors;

      this.$props.colorData.currentOptionColors = [
        ...this.$props.colorData.currentOptionColors,
        ...selected,
      ];

      this.selectedColors = [];
    },
    removeFromSelected() {
      let selected = this.selectedCurrentColors.map((select) => {
        return {
          value: select,
        };
      });

      selected = hasInLeft(this.$props.colorData.allColors, selected);

      this.$props.colorData.currentOptionColors = onlyInLeft(
        this.$props.colorData.currentOptionColors,
        selected
      );
      this.optionColors = this.allOptionColors;

      this.optionColors = [...this.optionColors, ...selected];
      this.allOptionColors = this.optionColors;

      this.selectedCurrentColors = [];
    },
  },
  async created() {
    const options = await store.dispatch("app-product/fetchCreateOptions");
    this.$props.colorData.allColors = options.colors;

    this.allOptionColors = onlyInLeft(
      this.$props.colorData.allColors,
      this.currentColors
    );
    this.optionColors = this.allOptionColors;
  },
};
</script>
