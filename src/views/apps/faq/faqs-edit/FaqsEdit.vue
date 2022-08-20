<template>
  <component :is="faqData === undefined ? 'div' : 'b-card'">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="faqData === undefined">
      <h4 class="alert-heading">Error fetching faq data</h4>
      <div class="alert-body">
        No faq found with this faq id. Check
        <b-link class="alert-link" :to="{ name: 'apps-faqs-list' }">
          Faq List
        </b-link>
        for other faqs.
      </div>
    </b-alert>

    <b-tabs v-if="faqData" pills>
      <!-- Tab: Account -->
      <b-tab active>
        <template #title>
          <feather-icon icon="FaqIcon" faq="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Faq</span>
        </template>
        <faq-edit-tab :faq-data="faqData" class="mt-2 pt-75" />
      </b-tab>
    </b-tabs>
  </component>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink } from "bootstrap-vue";
import { ref, onUnmounted } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";
import faqStoreModule from "../faqStoreModule";
import FaqEditTab from "./FaqEditTab.vue";

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    FaqEditTab,
  },
  setup() {
    const faqData = ref(null);

    const Faq_APP_STORE_MODULE_NAME = "app-faq";

    // Register module
    if (!store.hasModule(Faq_APP_STORE_MODULE_NAME))
      store.registerModule(Faq_APP_STORE_MODULE_NAME, faqStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Faq_APP_STORE_MODULE_NAME))
        store.unregisterModule(Faq_APP_STORE_MODULE_NAME);
    });

    store
      .dispatch("app-faq/fetchFaq", { id: router.currentRoute.params.id })
      .then((response) => {
        faqData.value = response.data;
      })
      .catch((error) => {
        if (error.response.status === 404) {
          faqData.value = undefined;
        }
      });

    return {
      faqData,
    };
  },
};
</script>

<style>
</style>
