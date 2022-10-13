<template>
  <div>
    <!-- Table Container Card -->
    <b-card no-body class="mb-0">
      <div class="m-2">
        <!-- Table Top -->
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Show</label>
            <v-select
              v-model="perPage"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block mx-50"
            />
            <label>entries</label>
          </b-col>

          <!-- Search -->
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Search..."
              />
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refShopProductTable"
        class="position-relative"
        :items="fetchShopProducts"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
        select-mode="single"
        @row-selected="onRowSelected"
        selectable
        striped
        bordered
      >
        <!-- Column: ShopProduct -->
        <template #cell(image)="data">
          <b-media vertical-align="center">
            <template #aside>
              <b-avatar size="40" :src="data.item.image" square />
            </template>
          </b-media>
        </template>

        <!-- Column: Status -->
        <template #cell(status)="data">
          <b-badge pill class="text-capitalize">
            {{ getStatus(data.item.status) }}
          </b-badge>
        </template>

        <template #cell(product_type)="data">
          <b-badge pill class="text-capitalize">
            {{ getType(data.item.product_type) }}
          </b-badge>
        </template>

        <template #cell(star)="data">
          <ul class="unstyled-list list-inline">
            <li
              v-for="star in 5"
              :key="star"
              class="ratings-list-item"
              :class="{ 'ml-25': star - 1 }"
            >
              <feather-icon
                icon="StarIcon"
                size="16"
                :class="[
                  { 'fill-current': star <= data.item.star },
                  star <= data.item.star ? 'text-warning' : 'text-muted',
                ]"
              />
            </li>
          </ul>
        </template>
      </b-table>
      <div class="mx-2 mb-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="
              d-flex
              align-items-center
              justify-content-center justify-content-sm-start
            "
          >
            <span class="text-muted"
              >Showing {{ dataMeta.from }} to {{ dataMeta.to }} of
              {{ dataMeta.of }} entries</span
            >
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="
              d-flex
              align-items-center
              justify-content-center justify-content-sm-end
            "
          >
            <b-pagination
              v-model="currentPage"
              :total-rows="totalShopProducts"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import useShopProduct from "./useShopProduct";
import productStoreModule from "../productStoreModule";
import router from "@/router";

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,

    vSelect,
  },
  props: ["shopId"],
  methods: {
    getType(type) {
      if (type == 0) return "Normal";
      if (type == 1) return "New";
      if (type == 2) return "Hot";
    },
    getStatus(num) {
      if (typeof num !== "number") return num;
      switch (num) {
        case 0:
          return "DRAFT";
        case 1:
          return "PUBLISHED";
        case 2:
          return "DELETED";
      }
    },
  },
  setup(props) {
    const ShopProduct_APP_STORE_MODULE_NAME = "app-product";

    // Register module
    if (!store.hasModule(ShopProduct_APP_STORE_MODULE_NAME))
      store.registerModule(
        ShopProduct_APP_STORE_MODULE_NAME,
        productStoreModule
      );

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(ShopProduct_APP_STORE_MODULE_NAME))
        store.unregisterModule(ShopProduct_APP_STORE_MODULE_NAME);
    });

    const onRowSelected = (item) => {
      router.push({
        name: "apps-product-details",
        params: { id: item[0].id },
      });
    };

    const {
      fetchShopProducts,
      tableColumns,
      perPage,
      currentPage,
      totalShopProducts,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refShopProductTable,
      refetchData,
    } = useShopProduct(props.shopId);

    return {
      // Sidebar
      onRowSelected,

      fetchShopProducts,
      tableColumns,
      perPage,
      currentPage,
      totalShopProducts,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refShopProductTable,
      refetchData,

      // Filter
      avatarText,
    };
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
