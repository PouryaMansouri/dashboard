<template>
  <b-card no-body>
    <b-card-header class="pb-50">
      <h5>Filters</h5>
    </b-card-header>
    <b-card-body>
      <b-row>
        <b-col cols="12" md="4" class="mb-md-0 mb-2">
          <label>IsActive</label>
          <v-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :value="isActiveFilter"
            :options="isActiveOptions"
            class="w-100"
            :reduce="(val) => val.value"
            @input="(val) => $emit('update:isActiveFilter', val)"
          />
        </b-col>
        <b-col cols="12" md="4" class="mb-md-0 mb-2">
          <label>IsNavbar</label>
          <v-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :value="isNavbarFilter"
            :options="isNavbarOptions"
            class="w-100"
            :reduce="(val) => val.value"
            @input="(val) => $emit('update:isNavbarFilter', val)"
          />
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import { BCard, BCardHeader, BCardBody, BRow, BCol } from "bootstrap-vue";
import vSelect from "vue-select";

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    vSelect,
  },
  props: {
    isActiveFilter: {
      type: [Boolean, null],
      default: null,
    },
    isNavbarFilter: {
      type: [Boolean, null],
      default: null,
    },
    isActiveOptions: {
      type: Array,
      required: true,
    },
    isNavbarOptions: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
