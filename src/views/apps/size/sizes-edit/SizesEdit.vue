<template>
  <component :is="sizeData === undefined ? 'div' : 'b-card'">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="sizeData === undefined">
      <h4 class="alert-heading">Error fetching size data</h4>
      <div class="alert-body">
        No size found with this size id. Check
        <b-link class="alert-link" :to="{ name: 'apps-sizes-list' }">
          Size List
        </b-link>
        for other sizes.
      </div>
    </b-alert>

    <b-tabs v-if="sizeData" pills>
      <!-- Tab: Account -->
      <b-tab active>
        <template #title>
          <feather-icon icon="SizeIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Size</span>
        </template>
        <size-edit-tab :size-data="sizeData" class="mt-2 pt-75" />
      </b-tab>
    </b-tabs>
  </component>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink } from "bootstrap-vue";
import { ref, onUnmounted } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";
import sizeStoreModule from "../sizeStoreModule";
import SizeEditTab from "./SizeEditTab.vue";

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    SizeEditTab,
  },
  setup() {
    const sizeData = ref(null);

    const Size_APP_STORE_MODULE_NAME = "app-size";

    // Register module
    if (!store.hasModule(Size_APP_STORE_MODULE_NAME))
      store.registerModule(Size_APP_STORE_MODULE_NAME, sizeStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Size_APP_STORE_MODULE_NAME))
        store.unregisterModule(Size_APP_STORE_MODULE_NAME);
    });

    store
      .dispatch("app-size/fetchSize", { id: router.currentRoute.params.id })
      .then((response) => {
        sizeData.value = response.data;
      })
      .catch((error) => {
        if (error.response.status === 404) {
          sizeData.value = undefined;
        }
      });

    return {
      sizeData,
    };
  },
};
</script>

<style>
</style>
