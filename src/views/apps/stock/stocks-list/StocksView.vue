<template>
  <div>
    <stocks-list-filters
      :shops-filter.sync="shopsFilter"
      :shops-options="shopsOptions"
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
        ref="refStockListTable"
        id="refStockListTable"
        class="position-relative"
        :items="fetchStocks"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
        select-mode="single"
        @row-selected="onRowSelected"
        selectable
        striped
        bordered
      >
        <template #cell(product)="data">
          {{ data.item.product.name }}
        </template>

        <template #cell(online_offline_status)="data">
          <b-badge
            pill
            :variant="`light-${
              data.item.online_offline_status === 1 ? 'info' : 'danger'
            }`"
            class="text-capitalize"
          >
            {{ getOnOffStatus(data.item.online_offline_status) }}
          </b-badge>
        </template>

        <template #cell(status)="data">
          <b-badge pill class="text-capitalize">
            {{ getStatus(data.item.status) }}
          </b-badge>
        </template>

        <template #cell(color)="data">
          {{ data.item.color.name }}
        </template>

        <template #cell(size)="data">
          {{ data.item.size.name }}
        </template>

        <template #cell(shop)="data">
          {{ data.item.shop.name }}
        </template>
        <!-- Column: Actions -->
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
import { avatarText } from "@core/utils/filter";
import useStocksList from "./useStocksList";
import stockStoreModule from "../stockStoreModule";
import StockListAddNew from "./StockListAddNew.vue";
import router from "@/router";
import StocksListFilters from "./StocksListFilters.vue";

export default {
  components: {
    StockListAddNew,
    StocksListFilters,
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
    getStatus(status) {
      if (status === 0) return "UnAvailable";
      if (status === 1) return "Available";
      if (status === 2) return "Out Of Stock";
    },
    getOnOffStatus(status) {
      if (status === 1) return "Online";
      if (status === 2) return "Offline";
    },
  },
  setup() {
    const Stock_APP_STORE_MODULE_NAME = "app-stock";

    // Register module
    if (!store.hasModule(Stock_APP_STORE_MODULE_NAME))
      store.registerModule(Stock_APP_STORE_MODULE_NAME, stockStoreModule);

    const shopsOptions = ref([]);

    const getShopsOption = () => {
      store.dispatch("app-shop/fetchShopsOption").then((response) => {
        const { data } = response;
        shopsOptions.value = data;
      });
    };

    getShopsOption();

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Stock_APP_STORE_MODULE_NAME))
        store.unregisterModule(Stock_APP_STORE_MODULE_NAME);
    });

    const isAddNewStockSidebarActive = ref(false);

    const onRowSelected = (item) => {
      router.push({
        name: "apps-product-details",
        params: { id: item[0].product.id },
      });
    };

    const {
      fetchStocks,
      tableColumns,
      perPage,
      currentPage,
      totalStocks,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refStockListTable,
      refetchData,
      downloadExcelTable,
      printTable,
      shopsFilter,

      // UI
    } = useStocksList();

    return {
      // Sidebar
      isAddNewStockSidebarActive,
      onRowSelected,
      fetchStocks,
      tableColumns,
      perPage,
      currentPage,
      totalStocks,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refStockListTable,
      refetchData,
      downloadExcelTable,
      printTable,
      shopsOptions,
      shopsFilter,

      // Filter
      avatarText,
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
