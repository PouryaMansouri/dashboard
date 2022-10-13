<template>
  <div>
    <stock-list-add-new
      :is-add-new-stock-sidebar-active.sync="isAddNewStockSidebarActive"
      @refetch-data="refetchData"
      :shopId="shopId"
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

          <!-- Search -->
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Search..."
              />
              <b-button
                variant="primary"
                @click="isAddNewStockSidebarActive = true"
              >
                <span class="text-nowrap">Register Stock</span>
              </b-button>
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
              @click="fillStockToOtherShop(data.item)"
              v-b-modal.modal-transfer-to-other-shop
            >
              <feather-icon icon="ChevronsUpIcon" />
              <span class="align-middle ml-50">Transfer To Other Shop</span>
            </b-dropdown-item>

            <b-dropdown-item
              @click="fillStockToOnlineShop(data.item)"
              v-b-modal.modal-transfer-to-self-shop
            >
              <feather-icon icon="ChevronsUpIcon" />
              <span class="align-middle ml-50">Transfer To Online Shop</span>
            </b-dropdown-item>

            <b-dropdown-item
              @click="fillStockToOfflineShop(data.item)"
              v-b-modal.modal-transfer-to-self-shop
            >
              <feather-icon icon="ChevronsUpIcon" />
              <span class="align-middle ml-50">Transfer To Offline Shop</span>
            </b-dropdown-item>
          </b-dropdown>
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
    <b-modal
      hide-footer
      id="modal-transfer-to-other-shop"
      scrollable
      title="Register"
      size="lg"
      cancel-variant="outline-secondary"
    >
      <transfer-stock-product-form-wizard
        :stock="stock"
        :shopId="shopId"
      ></transfer-stock-product-form-wizard>
    </b-modal>

    <b-modal
      hide-footer
      id="modal-transfer-to-self-shop"
      scrollable
      title="Register"
      size="lg"
      cancel-variant="outline-secondary"
    >
      <transfer-self-stock-product-form-wizard
        :stock="stock"
      ></transfer-self-stock-product-form-wizard>
    </b-modal>
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
  BModal,
  VBModal,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import useStocksList from "./useStocksList";
import stockStoreModule from "../stockStoreModule";
import StockListAddNew from "./StockListAddNew.vue";
import TransferStockProductFormWizard from "@views/apps/stock/stocks-transfer-product/TransferStockProductFormWizard.vue";
import TransferSelfStockProductFormWizard from "@views/apps/stock/stocks-transfer-product/TransferSelfStockProductFormWizard.vue";
import router from "@/router";

export default {
  directives: {
    "b-modal": VBModal,
  },
  components: {
    BModal,
    StockListAddNew,
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
    TransferStockProductFormWizard,
    TransferSelfStockProductFormWizard,
  },
  data() {
    return {
      stock: {
        stock: 0,
        quantity: 0,
        transfer_type: 4,
        transfer_to_shop: 0,
        purchase_price: 0,
        transfer_price: 0,
        transfer_datetime: null,
        transfer_note: "",
      },
    };
  },
  methods: {
    fillStockToOtherShop(row) {
      this.stock.stock = row.id;
      this.stock.transfer_type = 4;
    },
    fillStockToOnlineShop(row) {
      this.stock.stock = row.id;
      this.stock.transfer_type = 3;
    },
    fillStockToOfflineShop(row) {
      this.stock.stock = row.id;
      this.stock.transfer_type = 2;
    },
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
  props: ["shopId"],
  setup(props) {
    const Stock_APP_STORE_MODULE_NAME = "app-stock";

    // Register module
    if (!store.hasModule(Stock_APP_STORE_MODULE_NAME))
      store.registerModule(Stock_APP_STORE_MODULE_NAME, stockStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Stock_APP_STORE_MODULE_NAME))
        store.unregisterModule(Stock_APP_STORE_MODULE_NAME);
    });

    const isAddNewStockSidebarActive = ref(false);

    const onRowSelected = (item) => {
      router.push({
        name: "apps-stocks-detail",
        params: { id: item[0].id },
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

      // UI
    } = useStocksList(props.shopId);

    return {
      // Sidebar
      isAddNewStockSidebarActive,

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

      // Filter
      avatarText,
      onRowSelected,
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
