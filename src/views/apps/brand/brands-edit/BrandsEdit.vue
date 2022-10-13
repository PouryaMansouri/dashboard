<template>
  <div>
    <component :is="brandData === undefined ? 'div' : 'b-card'">
      <!-- Alert: No item found -->
      <b-alert variant="danger" :show="brandData === undefined">
        <h4 class="alert-heading">Error fetching brand data</h4>
        <div class="alert-body">
          No brand found with this brand id. Check
          <b-link class="alert-link" :to="{ name: 'apps-brands-list' }">
            Brand List
          </b-link>
          for other brands.
        </div>
      </b-alert>

      <b-tabs v-if="brandData" pills>
        <b-tab active>
          <template #title>
            <feather-icon icon="BrandIcon" size="16" class="mr-0 mr-sm-50" />
            <span class="d-none d-sm-inline">Brand</span>
          </template>
          <brand-edit-tab :brand-data="brandData" class="mt-2 pt-75" />
        </b-tab>
      </b-tabs>
    </component>
    <div class="m-1">
      <b-row>
        <brand-logs :brandId="brandData.id"></brand-logs>
      </b-row>
    </div>
  </div>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink, BRow } from "bootstrap-vue";
import { ref, onUnmounted } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";
import brandStoreModule from "../brandStoreModule";
import BrandEditTab from "./BrandEditTab.vue";
import BrandLogs from "@views/apps/log/brand-logs/BrandLogs.vue";

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BRow,
    BAlert,
    BLink,
    BrandEditTab,
    BrandLogs,
  },
  setup() {
    const brandData = ref(null);

    const BRAND_APP_STORE_MODULE_NAME = "app-brand";

    // Register module
    if (!store.hasModule(BRAND_APP_STORE_MODULE_NAME))
      store.registerModule(BRAND_APP_STORE_MODULE_NAME, brandStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(BRAND_APP_STORE_MODULE_NAME))
        store.unregisterModule(BRAND_APP_STORE_MODULE_NAME);
    });

    store
      .dispatch("app-brand/fetchBrand", { id: router.currentRoute.params.id })
      .then((response) => {
        brandData.value = response.data;
      })
      .catch((error) => {
        if (error.response.status === 404) {
          brandData.value = undefined;
        }
      });

    return {
      brandData,
    };
  },
};
</script>

<style>
</style>
