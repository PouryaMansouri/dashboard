<template>
  <b-card v-if="data" no-body class="card-company-table">
    <b-card-header>
      <b-card-title>Top Products</b-card-title>
    </b-card-header>
    <b-table :items="data" responsive :fields="fields" class="mb-0"
        select-mode="single"
        @row-selected="onRowSelected"
        selectable
        striped
        bordere>
      <!-- company -->

      <!-- category -->
      <template #cell(category)="data">
        <div class="d-flex align-items-center">
          <b-avatar class="mr-1" :variant="data.item.avatarColor">
            <feather-icon size="18" :icon="data.item.avatarIcon" />
          </b-avatar>
          <span>{{ data.item.avatarTitle }}</span>
        </div>
      </template>

      <!-- views -->
      <template #cell(views)="data">
        <div class="d-flex flex-column">
          <span class="font-weight-bolder mb-25">{{
            data.item.viewTitle
          }}</span>
          <span class="font-small-2 text-muted text-nowrap">{{
            data.item.viewsub
          }}</span>
        </div>
      </template>

      <!-- revenue -->
      <template #cell(revenue)="data">
        {{ "$" + data.item.revenue }}
      </template>

      <!-- sales -->
      <template #cell(sales)="data">
        <div class="d-flex align-items-center">
          <span class="font-weight-bolder mr-1">{{
            data.item.sales + "%"
          }}</span>
          <feather-icon
            :icon="data.item.loss ? 'TrendingDownIcon' : 'TrendingUpIcon'"
            :class="data.item.loss ? 'text-danger' : 'text-success'"
          />
        </div>
      </template>
    </b-table>
  </b-card>
</template>

<script>
import {
  BCard,
  BTable,
  BAvatar,
  BImg,
  BCardHeader,
  BCardTitle,
} from "bootstrap-vue";
import router from '@/router';

export default {
  components: {
    BCard,
    BTable,
    BAvatar,
    BImg,
    BCardTitle,
    BCardHeader,
  },
  methods: {
    onRowSelected(item) {
      router.push({
        name: "apps-product-details",
        params: { id: item[0].id },
      });
    },
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      fields: [
        { key: "id" },
        { key: "product__name", label: "Product Name" },
        { key: "shop__name", label: "Shop Name" },
        { key: "color__name", label: "Color" },
        { key: "size__name", label: "Size" },
        { key: "total_sell" },
        { key: "total_quantity" },
        { key: "total_orders" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@core/scss/base/bootstrap-extended/include";
@import "~@core/scss/base/components/variables-dark";

.card-company-table ::v-deep td .b-avatar.badge-light-company {
  .dark-layout & {
    background: $theme-dark-body-bg !important;
  }
}
</style>
