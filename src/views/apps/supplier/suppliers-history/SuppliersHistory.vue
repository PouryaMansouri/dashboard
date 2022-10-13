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
            {{ data.item.status }}
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
              :to="{ name: 'apps-stocks-view', params: { id: data.item.id } }"
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
import router from '@/router'
import { ref, onUnmounted } from "@vue/composition-api";
import useSuppliersHistory from "./useSuppliersHistory";
import supplierStoreModule from "../supplierStoreModule";

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
      if (status == "Pending") return "warning";
      if (status == "Canceled") return "danger";
      if (status == "Transferred") return "success";
    };
    const Supplier_APP_STORE_MODULE_NAME = "app-supplier";

    // Register module
    if (!store.hasModule(Supplier_APP_STORE_MODULE_NAME))
      store.registerModule(Supplier_APP_STORE_MODULE_NAME, supplierStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Supplier_APP_STORE_MODULE_NAME))
        store.unregisterModule(Supplier_APP_STORE_MODULE_NAME);
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
      refStockListTable,
      refetchData,

      // UI
    } = useSuppliersHistory(router.currentRoute.params.id);

    return {
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
      refStockListTable,
      refetchData,
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
