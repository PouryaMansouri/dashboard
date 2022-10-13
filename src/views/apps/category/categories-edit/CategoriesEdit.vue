<template>
  <div>
    <component :is="categoryData === undefined ? 'div' : 'b-card'">
      <!-- Alert: No item found -->
      <b-alert variant="danger" :show="categoryData === undefined">
        <h4 class="alert-heading">Error fetching category data</h4>
        <div class="alert-body">
          No category found with this category id. Check
          <b-link class="alert-link" :to="{ name: 'apps-categories-list' }">
            Category List
          </b-link>
          for other categories.
        </div>
      </b-alert>

      <b-tabs v-if="categoryData" pills>
        <!-- Tab: Account -->
        <b-tab active>
          <template #title>
            <feather-icon icon="CategoryIcon" size="16" class="mr-0 mr-sm-50" />
            <span class="d-none d-sm-inline">Category</span>
          </template>
          <category-edit-tab :category-data="categoryData" class="mt-2 pt-75" />
        </b-tab>
      </b-tabs>
    </component>
    <div class="m-1">
      <b-row>
        <category-logs :categoryId="categoryData.id"></category-logs>
      </b-row>
    </div>
  </div>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink, BRow, BCol } from "bootstrap-vue";
import { ref, onUnmounted } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";
import categoryStoreModule from "../categoryStoreModule";
import CategoryEditTab from "./CategoryEditTab.vue";
import CategoryLogs from "@views/apps/log/category-logs/CategoryLogs.vue";

export default {
  components: {
    BTab,
    BTabs,
    BRow,
    BCol,
    BCard,
    BAlert,
    BLink,
    CategoryEditTab,
    CategoryLogs,
  },
  setup() {
    const categoryData = ref(null);

    const CATEGORY_APP_STORE_MODULE_NAME = "app-category";

    // Register module
    if (!store.hasModule(CATEGORY_APP_STORE_MODULE_NAME))
      store.registerModule(CATEGORY_APP_STORE_MODULE_NAME, categoryStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CATEGORY_APP_STORE_MODULE_NAME))
        store.unregisterModule(CATEGORY_APP_STORE_MODULE_NAME);
    });

    store
      .dispatch("app-category/fetchCategory", {
        id: router.currentRoute.params.id,
      })
      .then((response) => {
        categoryData.value = response.data;
      })
      .catch((error) => {
        if (error.response.status === 404) {
          categoryData.value = undefined;
        }
      });

    return {
      categoryData,
    };
  },
};
</script>

<style>
</style>
