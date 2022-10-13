<template>
  <b-card v-if="data" no-body class="card-company-table">
    <b-card-header>
      <b-card-title>Top Suppliers</b-card-title>
    </b-card-header>
    <b-table :items="data" responsive :fields="fields" class="mb-0"
        select-mode="single"
        @row-selected="onRowSelected"
        selectable
        striped
        bordere>
      <!-- company -->
      <!-- <template #cell(name)="data">
        {{ data.item.first_name }} {{ data.item.last_name }}
      </template> -->

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
        name: "apps-suppliers-edit",
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
        { key: "name" },
        { key: "times_supplied" },
        { key: "quantity" },
        { key: "value_price" },
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
