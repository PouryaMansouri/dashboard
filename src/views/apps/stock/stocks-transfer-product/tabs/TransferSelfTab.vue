<template>
  <b-row>
    <!-- <b-col md="6">
      <b-row>
        <b-col cols="12">
          <b-input-group class="input-group-merge mb-1">
            <b-form-input
              @input="searchFilter"
              placeholder="Search Suppliers"
            />
            <b-input-group-append is-text>
              <feather-icon icon="SearchIcon" class="text-muted" />
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-form-group label="Buy From" label-for="buy_from">
        <b-form-select
          v-model="selected"
          :options="optionSuppliers"
          :select-size="4"
          @change="selectSupplier"
        />
      </b-form-group>
    </b-col> -->
    <b-col md="6">
      <b-form-group label="Transfer DateTime" label-for="transfer_datetime">
        <flat-pickr
          v-model="stock.transfer_datetime"
          class="form-control"
          :config="{
            enable: [new Date()],
            defaultDate: new Date(),
            altInput: true,
            altFormat: 'F j, Y',
            enableTime: true,
            dateFormat: 'Y-m-d H:i',
          }"
        />
      </b-form-group>
    </b-col>
    <b-col md="6">
      <b-form-group label="Quantity" label-for="quantity">
        <b-form-input
          id="quantity"
          min="0"
          type="number"
          v-model="stock.quantity"
        />
      </b-form-group>
    </b-col>
    <b-col md="6">
      <b-form-group label="Transfer Note" label-for="transfer_note">
        <b-form-textarea id="transfer_note" v-model="stock.transfer_note" />
      </b-form-group>
    </b-col>
  </b-row>
</template>

<script>
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
import flatPickr from "vue-flatpickr-component";
import store from "@/store";

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    // eslint-disable-next-line vue/no-unused-components
    BFormSelect,
    BButtonGroup,
    BButton,
    BInputGroup,
    BInputGroupAppend,
    flatPickr,
    BFormTextarea,
  },
  props: {
    stock: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      optionSuppliers: [],
      selected: null,
      allOptionSuppliers: [],
    };
  },
  computed: {},
  methods: {
    searchFilter(value) {
      const filteredData = this.allOptionSuppliers.filter((item) =>
        item.text.toLowerCase().includes(value)
      );
      this.optionSuppliers = filteredData;
    },
    selectSupplier(value) {
      this.$props.stock.buy_from = value;
    },
    showSupplier(value) {
      const filteredData = this.optionSuppliers.filter(
        (item) => item.value == value
      );

      if (filteredData.length != 0) {
        return filteredData[0].text;
      }
      return "";
    },
  },
  async created() {
    const options = await store.dispatch("app-supplier/fetchSuppliersOption");

    this.allOptionSuppliers = options;
    this.optionSuppliers = options;
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>