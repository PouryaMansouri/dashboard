<template>
  <div>
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

    <template v-if="stockData">
      <!-- First Row -->
      <b-row>
        <b-col cols="12">
          <b-card>
            <b-row>
              <b-col cols="4"
                ><h4>Product</h4>
                {{ stockData.product.name }}</b-col
              ><b-col cols="4"
                ><h4>Size</h4>
                {{ stockData.size.name }}</b-col
              ><b-col cols="4"
                ><h4>Color</h4>
                {{ stockData.color.name }}</b-col
              ><b-col cols="4"
                ><h4>Shop</h4>
                {{ stockData.transfer_to_shop.name }}</b-col
              >
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script>
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
} from "bootstrap-vue";
import stockStoreModule from "../stockStoreModule";

export default {
  components: {
    BRow,
    BCol,
    BAlert,
    BLink,
    BCard,
    BButton,
    BAvatar,
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
