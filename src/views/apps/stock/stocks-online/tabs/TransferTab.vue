<template>
  <b-row>
    <b-col md="6">
      <b-form-group label="Buy From" label-for="buy_from">
        <b-form-input id="buy_from" v-model="stock.buy_from" />
      </b-form-group>
    </b-col>
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
        <b-form-input id="quantity" type="number" v-model="stock.quantity" />
      </b-form-group>
    </b-col>
    <b-col md="6">
      <b-form-group label="Purchase Price" label-for="purchase_price">
        <b-form-input
          id="purchase_price"
          type="number"
          v-model="stock.purchase_price"
        />
      </b-form-group>
    </b-col>
    <b-col md="6">
      <b-form-group label="Transfer Note" label-for="transfer_note">
        <b-form-input id="transfer_note" v-model="stock.transfer_note" />
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
} from "bootstrap-vue";
import flatPickr from "vue-flatpickr-component";

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
  },
  props: {
    stock: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
  async created() {},
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>