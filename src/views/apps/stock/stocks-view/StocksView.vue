<template>
  <div v-if="stockData">
    <b-table
      :items="[stockData]"
      responsive
      :fields="[
        { key: 'id', sortable: true },
        { key: 'product', sortable: true },
        { key: 'color', sortable: true },
        { key: 'size', sortable: true },
        { key: 'shop', sortable: true },
        { key: 'quantity', sortable: true },
        { key: 'price_without_discount', label: 'price', sortable: true },
        { key: 'discount', sortable: true },
        { key: 'price', label: 'final_price', sortable: true },
        {
          key: 'online_offline_status',
          label: 'online/offline',
          sortable: true,
        },
        { key: 'status', sortable: true },
      ]"
    >
      <template #cell(product)="data">
        {{ data.item.product.name }}
      </template>

      <template #cell(discount)="data"> {{ data.item.discount }}% </template>

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
    </b-table>
    <app-collapse accordion type="margin">
      <app-collapse-item title="Pricing">
        <b-row class="match-height">
          <b-col lg="12">
            <b-card>
              <b-tabs content-class="pt-1" fill>
                <b-tab active title="Price">
                  <b-row>
                    <b-col cols="6">
                      <div
                        class="d-flex align-items-center justify-content-end"
                      >
                        <b-form-input
                          class="d-inline-block mr-1"
                          v-model="priceValue"
                        />
                        <b-button @click="addPrice" variant="primary">
                          <span class="text-nowrap">Add Price</span>
                        </b-button>
                      </div>
                    </b-col>
                  </b-row>
                  <div
                    class="d-flex align-items-center justify-content-end m-5"
                  >
                    <b-table
                      :items="prices"
                      responsive
                      :fields="[
                        { key: 'id', sortable: true },
                        { key: 'price', sortable: true },
                        { key: 'who_add', sortable: true },
                        { key: 'created_at', sortable: true },
                      ]"
                    >
                      <template #cell(who_add)="data">
                        {{
                          data.item.who_add.first_name +
                          " " +
                          data.item.who_add.last_name
                        }}
                      </template>

                      <template #cell(created_at)="data">
                        {{ new Date(data.item.created_at) }}
                      </template>
                    </b-table>
                  </div>
                </b-tab>
                <b-tab title="Discount">
                  <b-row>
                    <b-col cols="6">
                      <div
                        class="d-flex align-items-center justify-content-end"
                      >
                        <b-form-input
                          class="d-inline-block mr-1"
                          v-model="discountValue"
                        />
                        <b-button @click="addDiscount" variant="primary">
                          <span class="text-nowrap">Add Discount</span>
                        </b-button>
                      </div>
                    </b-col>
                  </b-row>
                  <div
                    class="d-flex align-items-center justify-content-end m-5"
                  >
                    <b-table
                      :items="discounts"
                      responsive
                      :fields="[
                        { key: 'id', sortable: true },
                        { key: 'discount', sortable: true },
                        { key: 'who_add', sortable: true },
                        { key: 'created_at', sortable: true },
                      ]"
                    >
                      <template #cell(who_add)="data">
                        {{
                          data.item.who_add.first_name +
                          " " +
                          data.item.who_add.last_name
                        }}
                      </template>

                      <template #cell(discount)="data">
                        {{ data.item.discount }}%
                      </template>

                      <template #cell(created_at)="data">
                        {{ new Date(data.item.created_at) }}
                      </template>
                    </b-table>
                  </div>
                </b-tab>
              </b-tabs>
            </b-card>
          </b-col>
        </b-row>
      </app-collapse-item>
    </app-collapse>
    <app-collapse accordion type="margin">
      <app-collapse-item title="Logs">
        <stock-logs :stockId="stockData.id" class="mt-2 pt-75" />
      </app-collapse-item>
    </app-collapse>
  </div>
</template>

<script>
import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";
import store from "@/store";
import router from "@/router";
import { ref, onUnmounted } from "@vue/composition-api";
import {
  BRow,
  BCol,
  BAlert,
  BLink,
  BCard,
  BButton,
  BAvatar,
  BTable,
  BTabs,
  BTab,
  BCardText,
  BFormInput,
  BBadge
} from "bootstrap-vue";
import stockStoreModule from "../stockStoreModule";
import StockLogs from "@views/apps/log/stock-logs/StockLogs.vue";

export default {
  components: {
    BRow,
    BCol,
    BAlert,
    BLink,
    BCard,
    BButton,
    BAvatar,
    BTable,
    BTabs,
    BTab,
    BCardText,
    BFormInput,
    AppCollapse,
    AppCollapseItem,
    StockLogs,
    BBadge
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
    const stockData = ref(null);

    const Stock_APP_STORE_MODULE_NAME = "app-stock";

    // Register module
    if (!store.hasModule(Stock_APP_STORE_MODULE_NAME))
      store.registerModule(Stock_APP_STORE_MODULE_NAME, stockStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Stock_APP_STORE_MODULE_NAME))
        store.unregisterModule(Stock_APP_STORE_MODULE_NAME);
    });

    const prices = ref([]);
    const discounts = ref([]);

    const priceValue = ref(0);
    const discountValue = ref(0);

    const addPrice = () => {
      store
        .dispatch("app-stock/addPrice", {
          stock: router.currentRoute.params.id,
          price: priceValue.value,
        })
        .then((response) => {
          getStockPricing();
          getStock();
        })
        .catch((error) => {});
    };

    const addDiscount = () => {
      store
        .dispatch("app-stock/addDiscount", {
          stock: router.currentRoute.params.id,
          discount: discountValue.value,
        })
        .then((response) => {
          getStockPricing();
          getStock();
        })
        .catch((error) => {});
    };

    const getStock = () => {
      store
        .dispatch("app-stock/fetchStock", { id: router.currentRoute.params.id })
        .then((response) => {
          stockData.value = response.data;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            stockData.value = undefined;
          }
        });
    };

    const getStockPricing = () => {
      store
        .dispatch("app-stock/fetchStockPricing", {
          id: router.currentRoute.params.id,
        })
        .then((response) => {
          prices.value = response.data.list_price;
          discounts.value = response.data.list_discount;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            prices.value = [];
            discounts.value = [];
          }
        });
    };

    getStock();
    getStockPricing();

    return {
      getStockPricing,
      prices,
      discounts,
      stockData,
      addPrice,
      addDiscount,
      priceValue,
      discountValue,
    };
  },
};
</script>

<style>
</style>
