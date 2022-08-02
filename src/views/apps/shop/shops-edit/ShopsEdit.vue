<template>
  <component :is="shopData === undefined ? 'div' : 'b-card'">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="shopData === undefined">
      <h4 class="alert-heading">Error fetching shop data</h4>
      <div class="alert-body">
        No shop found with this shop id. Check
        <b-link class="alert-link" :to="{ name: 'apps-shops-list' }">
          Shop List
        </b-link>
        for other shops.
      </div>
    </b-alert>

    <b-tabs v-if="shopData" pills>
      <b-tab active>
        <template #title>
          <feather-icon icon="ShopIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Shop</span>
        </template>
        <shop-edit-tab :shop-data="shopData" class="mt-2 pt-75" />
      </b-tab>
    </b-tabs>
  </component>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink } from "bootstrap-vue";
import { ref, onUnmounted } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";
import shopStoreModule from "../shopStoreModule";
import ShopEditTab from "./ShopEditTab.vue";

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    ShopEditTab,
  },
  setup() {
    const shopData = ref(null);

    const Shop_APP_STORE_MODULE_NAME = "app-shop";

    // Register module
    if (!store.hasModule(Shop_APP_STORE_MODULE_NAME))
      store.registerModule(Shop_APP_STORE_MODULE_NAME, shopStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Shop_APP_STORE_MODULE_NAME))
        store.unregisterModule(Shop_APP_STORE_MODULE_NAME);
    });

    store
      .dispatch("app-shop/fetchShop", { id: router.currentRoute.params.id })
      .then((response) => {
        shopData.value = response.data;
      })
      .catch((error) => {
        if (error.response.status === 404) {
          shopData.value = undefined;
        }
      });

    return {
      shopData,
    };
  },
};
</script>

<style>
</style>
