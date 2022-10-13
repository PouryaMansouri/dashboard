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
        </b-row>
      </div>

      <b-table
        ref="refUserActionLogsTable"
        id="refUserActionLogsTable"
        class="position-relative"
        :items="fetchLogsList"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
      >
        <template #cell(object_type)="data">
          <b-badge pill class="text-capitalize">
            {{ data.item.object_type }}
          </b-badge>
        </template>

        <template #cell(full_name)="data">
          {{ data.item.user.first_name }} {{ data.item.user.last_name }}
        </template>

        <template #cell(created_at)="data">
          {{ new Date(data.item.created_at) }}
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
              :total-rows="totalLogs"
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
import useLogsList from "./useLogsList";
import logStoreModule from "../logStoreModule";

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
  props: ["userId"],
  setup(props) {
    const LOG_APP_STORE_MODULE_NAME = "app-log";

    // Register module
    if (!store.hasModule(LOG_APP_STORE_MODULE_NAME))
      store.registerModule(LOG_APP_STORE_MODULE_NAME, logStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(LOG_APP_STORE_MODULE_NAME))
        store.unregisterModule(LOG_APP_STORE_MODULE_NAME);
    });

    const {
      fetchLogsList,
      tableColumns,
      perPage,
      currentPage,
      totalLogs,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refUserActionLogsTable,
      refetchData,
      downloadExcelTable,
      printTable,
      // UI
    } = useLogsList(props.userId);

    return {
      fetchLogsList,
      tableColumns,
      perPage,
      currentPage,
      totalLogs,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refUserActionLogsTable,
      refetchData,
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
