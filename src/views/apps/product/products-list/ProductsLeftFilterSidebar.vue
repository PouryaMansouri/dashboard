<template>
  <div class="sidebar-detached sidebar-left">
    <div class="sidebar">
      <div class="sidebar-shop" :class="{ show: mqShallShowLeftSidebar }">
        <b-row>
          <b-col cols="12">
            <h6 class="filter-heading d-none d-lg-block">Filters</h6>
          </b-col>
        </b-row>
        <b-card>
          <!-- <div class="wrapper">
            <vue-perfect-scrollbar
              :settings="perfectScrollbarSettings"
              class="list"
              style="height: 360px; overflow-y: auto"
            >
              <div v-for="i in filterOptions.categories" :key="i.value">
                {{ i.text }}
              </div>
            </vue-perfect-scrollbar>
          </div> -->

          <div class="product-categories wrapper">
            <h6 class="filter-title">Categories</h6>
            <vue-perfect-scrollbar
              :settings="perfectScrollbarSettings"
              class="list"
              style="height: 50vh; overflow-y: auto"
            >
              <b-form-radio-group
                v-model="filters.categories"
                class="categories-radio-group"
                stacked
                :options="filterOptions.categories"
              />
            </vue-perfect-scrollbar>
          </div>

          <div class="brands wrapper">
            <h6 class="filter-title">Brands</h6>
            <vue-perfect-scrollbar
              :settings="perfectScrollbarSettings"
              class="list"
              style="height: 50vh; overflow-y: auto"
            >
              <b-form-radio-group
                v-model="filters.brands"
                class="brands-radio-group"
                stacked
                :options="filterOptions.brands"
              />
            </vue-perfect-scrollbar>
          </div>
        </b-card>
      </div>
    </div>

    <div
      class="body-content-overlay"
      :class="{ show: mqShallShowLeftSidebar }"
      @click="$emit('update:mq-shall-show-left-sidebar', false)"
    />
  </div>
</template>

<script>
import { BRow, BCol, BCard, BFormRadioGroup, BLink } from "bootstrap-vue";
import VueSlider from "vue-slider-component";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import store from "@/store";

export default {
  components: {
    BRow,
    BCol,
    BFormRadioGroup,
    BLink,
    BCard,

    // 3rd Party
    VueSlider,
    VuePerfectScrollbar,
  },
  data() {
    return {
      perfectScrollbarSettings: {
        maxScrollbarLength: 150,
        wheelPropagation: false,
      },
      filterOptions: { categories: [], brands: [] },
    };
  },
  async created() {
    this.filterOptions = await store.dispatch(
      "app-product/fetchFilterOptions",
      { type: "All" }
    );
  },
  props: {
    filters: {
      type: Object,
      required: true,
    },
    mqShallShowLeftSidebar: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss">
@import "~@core/scss/vue/libs/vue-slider.scss";
</style>

<style lang="scss" scoped>
.categories-radio-group,
.brands-radio-group,
.price-range-defined-radio-group {
  ::v-deep > .custom-control {
    margin-bottom: 0.75rem;
  }
}
</style>
