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
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-button variant="outline-secondary" @click="downloadExcelTable">
                <span class="text-nowrap">Download Excel</span>
              </b-button>
              <b-button variant="outline-primary" @click="printTable">
                <span class="text-nowrap">Print</span>
              </b-button>
            </div>
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
        ref="refCustomersCartListTable"
        id="refCustomersCartListTable"
        class="position-relative"
        :items="fetchCustomersCarts"
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
        <template #cell(name)="data">
          {{ data.item.first_name + " " + data.item.last_name }}
        </template>

        <template #cell(last_login)="data">
          {{ new Date(data.item.last_login) }}
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
              :total-rows="totalCustomersCarts"
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
import useCustomersCartsList from "./useCustomersCartsList";
import customerStoreModule from "../customerStoreModule";
import router from '@/router';

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
  methods: {},
  setup() {
    const CustomersCart_APP_STORE_MODULE_NAME = "app-customer";

    // Register module
    if (!store.hasModule(CustomersCart_APP_STORE_MODULE_NAME))
      store.registerModule(
        CustomersCart_APP_STORE_MODULE_NAME,
        customerStoreModule
      );

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CustomersCart_APP_STORE_MODULE_NAME))
        store.unregisterModule(CustomersCart_APP_STORE_MODULE_NAME);
    });

    const onRowSelected = (item) => {
      router.push({
        name: "apps-customers-view",
        params: { id: item[0].id },
      });
    };

    const {
      fetchCustomersCarts,
      tableColumns,
      perPage,
      currentPage,
      totalCustomersCarts,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refCustomersCartListTable,
      refetchData,
      downloadExcelTable,
      printTable,

      // UI
    } = useCustomersCartsList();

    return {
      onRowSelected,
      // Sidebar
      fetchCustomersCarts,
      tableColumns,
      perPage,
      currentPage,
      totalCustomersCarts,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refCustomersCartListTable,
      refetchData,

      // Filter
      avatarText,
      downloadExcelTable,
      printTable,
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