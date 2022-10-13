<template>
  <div>
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

          <!-- Search -->
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Search..."
              />
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refStockListHistoryTable"
        id="refStockListHistoryTable"
        class="position-relative"
        :items="fetchStocksHistory"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
      >
        <template #cell(status)="data">
          <b-badge
            pill
            :variant="`light-${resolveStatusVariant(data.item.status)}`"
            class="text-capitalize"
          >
            {{ getStatus(data.item.status) }}
          </b-badge>
        </template>

        <template #cell(product)="data">
          {{ data.item.product.name }}
        </template>

        <template #cell(color)="data">
          {{ data.item.color.name }}
        </template>

        <template #cell(size)="data">
          {{ data.item.size.name }}
        </template>

        <template #cell(transfer_to_shop)="data">
          {{ data.item.transfer_to_shop.name }}
        </template>

        <!-- Column: Actions -->
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

            <b-dropdown-item
              :to="{ name: 'apps-stocks-detail', params: { id: data.item.stock } }"
            >
              <feather-icon icon="EyeIcon" />
              <span class="align-middle ml-50">View</span>
            </b-dropdown-item>
          </b-dropdown>
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
              :total-rows="totalStocks"
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
import useStocksHistory from "./useStocksHistory";
import stockStoreModule from "../stockStoreModule";

export default {
  components: {
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
  setup() {
    const resolveStatusVariant = (status) => {
      if (status == 0) return "danger";
      if (status == 1) return "warning";
      if (status == 2) return "success";
    };
    const getStatus = (status) => {
      if (status == 0) return "Canceled";
      if (status == 1) return "Pending";
      if (status == 2) return "Transferred";
    };
    const Stock_APP_STORE_MODULE_NAME = "app-stock";

    // Register module
    if (!store.hasModule(Stock_APP_STORE_MODULE_NAME))
      store.registerModule(Stock_APP_STORE_MODULE_NAME, stockStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Stock_APP_STORE_MODULE_NAME))
        store.unregisterModule(Stock_APP_STORE_MODULE_NAME);
    });

    const {
      fetchStocksHistory,
      tableColumns,
      perPage,
      currentPage,
      totalStocks,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refStockListHistoryTable,
      refetchData,
      downloadExcelTable,
      printTable,

      // UI
    } = useStocksHistory();

    return {
      getStatus,
      resolveStatusVariant,
      fetchStocksHistory,
      tableColumns,
      perPage,
      currentPage,
      totalStocks,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refStockListHistoryTable,
      refetchData,
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
