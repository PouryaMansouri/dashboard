<template>
  <div>
    <!-- Filters -->
    <orders-list-filters
      :status-filter.sync="statusFilter"
      :order-type-filter.sync="orderTypeFilter"
      :status-options="statusOptions"
      :order-type-options="orderTypeOptions"
    />

    <!-- Table Container Card -->
    <b-card no-body class="mb-0">
      <div class="m-2">
        <!-- Table Top -->
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Show</label>
            <v-select
              v-model="perPage"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block mx-50"
            />
            <label>entries</label>
          </b-col>
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-button variant="outline-secondary" @click="downloadExcelTable">
                <span class="text-nowrap">Download Excel</span>
              </b-button>
              <b-button variant="outline-primary" @click="printTable">
                <span class="text-nowrap">Print</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refOrderListTable"
        id="refOrderListTable"
        class="position-relative"
        :items="fetchOrders"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
      >
        <template #row-details="row">
          <b-card>
            <b-row>Order Details:</b-row>
            <b-row class="mb-2">
              <b-table
                striped
                small
                hover
                :items="row.item.order_items"
                :fields="[
                  'id',
                  'stock.shop.name',
                  'stock.product.name',
                  'stock.color.name',
                  'stock.size.name',
                  'quantity',
                  'price',
                  'total_price',
                  'status',
                  'delivery_status',
                ]"
              >
                <template #cell(delivery_status)="data">
                  <b-badge pill class="text-capitalize">
                    {{ resolveDeliveryStatusVariant(data.item.delivery_status) }}
                  </b-badge>
                </template>

                <template #cell(status)="data">
                  <b-badge pill class="text-capitalize">
                    {{ getStatus(data.item.status) }}
                  </b-badge>
                </template>
              </b-table>
            </b-row>
            <b-button
              size="sm"
              variant="outline-secondary"
              @click="row.toggleDetails"
            >
              Hide Stocks
            </b-button>
          </b-card>
        </template>

        <!-- Column: Actions -->
        <template #cell(details)="row">
          <div>
            <b-button variant="outline-secondary" @click="row.toggleDetails">
              details
            </b-button>
          </div>
        </template>

        <template #cell(actions)="data">
          <b-dropdown
            variant="link"
            no-caret
            :right="$store.state.appConfig.isRTL"
          >
            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>
            <b-dropdown-item @click="orderDelete(data.item.id)">
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Cancel</span>
            </b-dropdown-item>
          </b-dropdown>
        </template>

        <template #cell(status)="data">
          <b-badge pill class="text-capitalize">
            {{ resolveStatusVariant(data.item.status) }}
          </b-badge>
        </template>

        <template #cell(order_type)="data">
          <b-badge
            pill
            :variant="`light-${
              data.item.order_type == 1 ? 'success' : 'danger'
            }`"
            class="text-capitalize"
          >
            {{ data.item.order_type == 1 ? "Online" : "Offline" }}
          </b-badge>
        </template>

        <template #cell(user)="data">
          {{ data.item.user.first_name + " " + data.item.user.last_name }}
        </template>

        <template #cell(name)="data">
          {{ data.item.first_name + " " + data.item.last_name }}
        </template>

        <template #cell(updated_at)="data">
          {{ new Date(data.item.updated_at) }}
        </template>
      </b-table>
      <div class="mx-2 mb-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="
              d-flex
              align-items-center
              justify-content-center justify-content-sm-start
            "
          >
            <span class="text-muted"
              >Showing {{ dataMeta.from }} to {{ dataMeta.to }} of
              {{ dataMeta.of }} entries</span
            >
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="
              d-flex
              align-items-center
              justify-content-center justify-content-sm-end
            "
          >
            <b-pagination
              v-model="currentPage"
              :total-rows="totalOrders"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import OrdersListFilters from "./OrdersListFilters.vue";
import useOrdersList from "./useOrdersList";
import orderStoreModule from "../orderStoreModule";

export default {
  components: {
    OrdersListFilters,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,

    vSelect,
  },
  methods: {
    resolveDeliveryStatusVariant(status) {
      if (status === 0) return "PENDING";
      if (status === 1) return "PROCESSING";
      if (status === 2) return "DELIVERED";
      return "CANCELED";
    },
    resolveStatusVariant(status) {
      if (status == 0) return "Pending";
      if (status == 1) return "Completed";
      if (status == 3) return "Expired";
      return "";
    },
    getStatus(status) {
      if (status == 0) return "Pending";
      if (status == 1) return "Completed";
      if (status == 4) return "FINISHED_BEFORE_PAYMENT";
      if (status == 8) return "EXPIRED";
      return "";
    },
  },
  setup() {
    const ORDER_APP_STORE_MODULE_NAME = "app-order";

    // Register module
    if (!store.hasModule(ORDER_APP_STORE_MODULE_NAME))
      store.registerModule(ORDER_APP_STORE_MODULE_NAME, orderStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(ORDER_APP_STORE_MODULE_NAME))
        store.unregisterModule(ORDER_APP_STORE_MODULE_NAME);
    });

    const statusOptions = [
      { label: "Pending", value: 0 },
      { label: "Completed", value: 1 },
      { label: "Expired", value: 3 },
    ];

    const orderTypeOptions = [
      { label: "Online", value: 1 },
      { label: "Offline", value: 2 },
    ];

    const orderDelete = (id) => {
      store.dispatch("app-order/deleteOrder", { id }).then(() => {
        window.location.reload(true);
      });
    };

    const {
      fetchOrders,
      tableColumns,
      perPage,
      currentPage,
      totalOrders,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refOrderListTable,
      refetchData,

      // UI
      // Extra Filters
      statusFilter,
      orderTypeFilter,
      downloadExcelTable,
      printTable,
    } = useOrdersList();

    return {
      orderDelete,
      // Sidebar
      fetchOrders,
      tableColumns,
      perPage,
      currentPage,
      totalOrders,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refOrderListTable,
      refetchData,

      // Filter
      avatarText,

      // UI
      statusOptions,
      orderTypeOptions,

      // Extra Filters
      statusFilter,
      orderTypeFilter,
      downloadExcelTable,
      printTable,
    };
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
