<template>
  <component :is="colorData === undefined ? 'div' : 'b-card'">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="colorData === undefined">
      <h4 class="alert-heading">Error fetching color data</h4>
      <div class="alert-body">
        No color found with this color id. Check
        <b-link class="alert-link" :to="{ name: 'apps-colors-list' }">
          Color List
        </b-link>
        for other colors.
      </div>
    </b-alert>

    <b-tabs v-if="colorData" pills>
      <!-- Tab: Account -->
      <b-tab active>
        <template #title>
          <feather-icon icon="ColorIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Color</span>
        </template>
        <color-edit-tab :color-data="colorData" class="mt-2 pt-75" />
      </b-tab>
    </b-tabs>
  </component>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink } from "bootstrap-vue";
import { ref, onUnmounted } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";
import colorStoreModule from "../colorStoreModule";
import ColorEditTab from "./ColorEditTab.vue";

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    ColorEditTab,
  },
  setup() {
    const colorData = ref(null);

    const Color_APP_STORE_MODULE_NAME = "app-color";

    // Register module
    if (!store.hasModule(Color_APP_STORE_MODULE_NAME))
      store.registerModule(Color_APP_STORE_MODULE_NAME, colorStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Color_APP_STORE_MODULE_NAME))
        store.unregisterModule(Color_APP_STORE_MODULE_NAME);
    });

    store
      .dispatch("app-color/fetchColor", { id: router.currentRoute.params.id })
      .then((response) => {
        colorData.value = response.data;
      })
      .catch((error) => {
        if (error.response.status === 404) {
          colorData.value = undefined;
        }
      });

    return {
      colorData,
    };
  },
};
</script>

<style>
</style>
