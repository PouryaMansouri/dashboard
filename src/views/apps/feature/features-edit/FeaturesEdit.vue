<template>
  <component :is="featureData === undefined ? 'div' : 'b-card'">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="featureData === undefined">
      <h4 class="alert-heading">Error fetching feature data</h4>
      <div class="alert-body">
        No feature found with this feature id. Check
        <b-link class="alert-link" :to="{ name: 'apps-features-list' }">
          Feature List
        </b-link>
        for other features.
      </div>
    </b-alert>

    <b-tabs v-if="featureData" pills>
      <!-- Tab: Account -->
      <b-tab active>
        <template #title>
          <feather-icon icon="FeatureIcon" feature="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Feature</span>
        </template>
        <feature-edit-tab :feature-data="featureData" class="mt-2 pt-75" />
      </b-tab>
    </b-tabs>
  </component>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink } from "bootstrap-vue";
import { ref, onUnmounted } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";
import featureStoreModule from "../featureStoreModule";
import FeatureEditTab from "./FeatureEditTab.vue";

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    FeatureEditTab,
  },
  setup() {
    const featureData = ref(null);

    const Feature_APP_STORE_MODULE_NAME = "app-feature";

    // Register module
    if (!store.hasModule(Feature_APP_STORE_MODULE_NAME))
      store.registerModule(Feature_APP_STORE_MODULE_NAME, featureStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Feature_APP_STORE_MODULE_NAME))
        store.unregisterModule(Feature_APP_STORE_MODULE_NAME);
    });

    store
      .dispatch("app-feature/fetchFeature", { id: router.currentRoute.params.id })
      .then((response) => {
        featureData.value = response.data;
      })
      .catch((error) => {
        if (error.response.status === 404) {
          featureData.value = undefined;
        }
      });

    return {
      featureData,
    };
  },
};
</script>

<style>
</style>
