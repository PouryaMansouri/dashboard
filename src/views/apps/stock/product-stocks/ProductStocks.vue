<template>
  <b-card no-body class="mb-0">
    <b-table
      ref="refStockListTable"
      class="position-relative"
      :items="fetchProductStocks"
      responsive
      :fields="tableColumns"
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
    >
      <template #row-details="row">
        <b-card v-if="rows(row.index) == 'offline'">
          <b-row>Offline Stocks</b-row>
          <b-row class="mb-2">
            <b-table
              striped
              select-mode="single"
              @row-selected="onRowSelected"
              selectable
              bordered
              small
              hover
              :items="row.item.offline_stock"
              :fields="[
                'stock_id',
                'size',
                'color',
                'purchase_price_total',
                'total_transfer_price',
                'stock_values',
                'quantity',
                'status',
                'price',
                'discount',
                'sell_in_month',
                'sell_in_year',
                'actions',
              ]"
            >
              <template #cell(actions)="data">
                <b-dropdown
                  variant="link"
                  no-caret
                  :right="$store.state.appConfig.isRTL"
                >
                  <template #button-content>
                    <feather-icon
                      icon="MoreVerticalIcon"
                      feature="16"
                      class="align-middle text-body"
                    />
                  </template>
                  <b-dropdown-item
                    @click="fillStockToOtherShop(data.item)"
                    v-b-modal.modal-transfer-to-other-shop
                  >
                    <feather-icon icon="ChevronsUpIcon" />
                    <span class="align-middle ml-50"
                      >Transfer To Other Shop</span
                    >
                  </b-dropdown-item>

                  <b-dropdown-item
                    @click="fillStockToOnlineShop(data.item)"
                    v-b-modal.modal-transfer-to-self-shop
                  >
                    <feather-icon icon="ChevronsUpIcon" />
                    <span class="align-middle ml-50"
                      >Transfer To Online Shop</span
                    >
                  </b-dropdown-item>
                </b-dropdown>
              </template>
              <template #cell(discount)="data">
                {{ data.item.discount }}%
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
        <b-card v-else>
          <b-row>Online Stocks</b-row>
          <b-row class="mb-2">
            <b-table
              striped
              select-mode="single"
              @row-selected="onRowSelected"
              selectable
              bordered
              small
              hover
              :items="row.item.online_stock"
              :fields="[
                'stock_id',
                'size',
                'color',
                'purchase_price_total',
                'total_transfer_price',
                'stock_values',
                'quantity',
                'status',
                'price',
                'discount',
                'sell_in_month',
                'sell_in_year',
                'actions',
              ]"
            >
              <template #cell(actions)="data">
                <b-dropdown
                  variant="link"
                  no-caret
                  :right="$store.state.appConfig.isRTL"
                >
                  <template #button-content>
                    <feather-icon
                      icon="MoreVerticalIcon"
                      feature="16"
                      class="align-middle text-body"
                    />
                  </template>
                  <b-dropdown-item
                    @click="fillStockToOfflineShop(data.item)"
                    v-b-modal.modal-transfer-to-self-shop
                  >
                    <feather-icon icon="ChevronsUpIcon" />
                    <span class="align-middle ml-50"
                      >Transfer To Offline Shop</span
                    >
                  </b-dropdown-item>
                </b-dropdown>
              </template>

              <template #cell(discount)="data">
                {{ data.item.discount }}%
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
      <template #cell(offline_stock)="row">
        <div @click="changeRows(row.index, 'offline')">
          <b-button
            variant="primary"
            :disabled="row.item.offline_stock.length === 0"
            @click="row.toggleDetails"
          >
            <span class="text-nowrap">{{ row.item.offline_stock.length }}</span>
          </b-button>
        </div>
      </template>

      <template #cell(online_stock)="row">
        <div @click="changeRows(row.index, 'online')">
          <b-button
            variant="primary"
            :disabled="row.item.online_stock.length === 0"
            @click="row.toggleDetails"
          >
            <span class="text-nowrap">{{ row.item.online_stock.length }}</span>
          </b-button>
        </div>
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
            :total-rows="totalProductStocks"
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
  </b-card>
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
import useProductStocks from "./useProductStocks";
import productStoreModule from "../../product/productStoreModule";
import TransferStockProductFormWizard from "@views/apps/stock/stocks-transfer-product/TransferStockProductFormWizard.vue";
import TransferSelfStockProductFormWizard from "@views/apps/stock/stocks-transfer-product/TransferSelfStockProductFormWizard.vue";
import router from "@/router";

export default {
  directives: {
    "b-modal": VBModal,
  },
  components: {
    BModal,
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
      stockClick: {},
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
      this.stock.stock = row.stock_id;
      this.stock.transfer_type = 4;
    },
    fillStockToOnlineShop(row) {
      this.stock.stock = row.stock_id;
      this.stock.transfer_type = 3;
    },
    fillStockToOfflineShop(row) {
      this.stock.stock = row.stock_id;
      this.stock.transfer_type = 2;
    },
    changeRows(index, type) {
      this.stockClick[index] = type;
    },
    rows(index) {
      return this.stockClick[index];
    },
  },
  props: ["productId"],
  setup(props) {
    const Product_Stock_APP_STORE_MODULE_NAME = "app-product";

    // Register module
    if (!store.hasModule(Product_Stock_APP_STORE_MODULE_NAME))
      store.registerModule(
        Product_Stock_APP_STORE_MODULE_NAME,
        productStoreModule
      );

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Product_Stock_APP_STORE_MODULE_NAME))
        store.unregisterModule(Product_Stock_APP_STORE_MODULE_NAME);
    });

    const onRowSelected = (item) => {
      router.push({
        name: "apps-stocks-detail",
        params: { id: item[0].stock_id },
      });
    };

    const {
      fetchProductStocks,
      tableColumns,
      perPage,
      currentPage,
      totalProductStocks,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refStockListTable,
      refetchData,

      // UI
    } = useProductStocks(props.productId);

    return {
      onRowSelected,
      // Sidebar

      fetchProductStocks,
      tableColumns,
      perPage,
      currentPage,
      totalProductStocks,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refStockListTable,
      refetchData,

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
