<template>
  <component :is="stockData === undefined ? 'div' : 'b-card'">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="stockData === undefined">
      <h4 class="alert-heading">Error fetching stock data</h4>
      <div class="alert-body">
        No stock found with this stock id. Check
        <b-link class="alert-link" :to="{ name: 'apps-stocks-list' }">
          Stock List
        </b-link>
        for other stocks.
      </div>
    </b-alert>

    <b-tabs v-if="stockData" pills>
      <b-tab active>
        <template #title>
          <feather-icon icon="StockIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Stock</span>
        </template>
        <stock-edit-tab :stock-data="stockData" class="mt-2 pt-75" />
      </b-tab>
    </b-tabs>
  </component>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink } from "bootstrap-vue";
import { ref, onUnmounted } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";
import stockStoreModule from "../stockStoreModule";
import StockEditTab from "./StockEditTab.vue";

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    StockEditTab,
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

    return {
      stockData,
    };
  },
};
</script>

<style>
</style>
