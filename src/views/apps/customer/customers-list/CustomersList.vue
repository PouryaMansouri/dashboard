<template>
  <div>
    <customer-list-add-new
      :is-add-new-customer-sidebar-active.sync="isAddNewCustomerSidebarActive"
      @refetch-data="refetchData"
    />

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
              <b-button
                variant="primary"
                @click="isAddNewCustomerSidebarActive = true"
              >
                <span class="text-nowrap">Add Customer</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refCustomerListTable"
        id="refCustomerListTable"
        class="position-relative"
        :items="fetchCustomers"
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
        <template #cell(is_active)="data">
          <b-badge
            pill
            :variant="`light-${resolveCustomerIsActiveStaffVariant(
              data.item.is_active
            )}`"
            class="text-capitalize"
          >
            {{ data.item.is_active == true ? "Active" : "Inactive" }}
          </b-badge>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-dropdown
            variant="link"
            no-caret
            :right="$store.state.appConfig.isRTL"
          >
            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>
            <b-dropdown-item
              :to="{
                name: 'apps-customers-view',
                params: { id: data.item.id },
              }"
            >
              <feather-icon icon="FileTextIcon" />
              <span class="align-middle ml-50">Details</span>
            </b-dropdown-item>

            <b-dropdown-item
              :to="{
                name: 'apps-customers-edit',
                params: { id: data.item.id },
              }"
            >
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>
          </b-dropdown>
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
              :total-rows="totalCustomers"
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
import useCustomersList from "./useCustomersList";
import customerStoreModule from "../customerStoreModule";
import CustomerListAddNew from "./CustomerListAddNew.vue";
import router from "@/router";

export default {
  components: {
    CustomerListAddNew,

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
  methods: {
    getRole(role) {
      if (role == 0) return "Normal";
      if (role == 1) return "Admin";
      if (role == 2) return "Cashier";
      if (role == 3) return "Stock Keeper";
    },
  },
  setup() {
    const Customer_APP_STORE_MODULE_NAME = "app-customer";

    // Register module
    if (!store.hasModule(Customer_APP_STORE_MODULE_NAME))
      store.registerModule(Customer_APP_STORE_MODULE_NAME, customerStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Customer_APP_STORE_MODULE_NAME))
        store.unregisterModule(Customer_APP_STORE_MODULE_NAME);
    });

    const isAddNewCustomerSidebarActive = ref(false);

    const onRowSelected = (item) => {
      router.push({
        name: "apps-customers-view",
        params: { id: item[0].id },
      });
    };

    const {
      fetchCustomers,
      tableColumns,
      perPage,
      currentPage,
      totalCustomers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refCustomerListTable,
      refetchData,

      // UI
      resolveCustomerIsActiveStaffVariant,

      downloadExcelTable,
      printTable,
    } = useCustomersList();

    return {
      // Sidebar
      isAddNewCustomerSidebarActive,

      fetchCustomers,
      tableColumns,
      perPage,
      currentPage,
      totalCustomers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refCustomerListTable,
      refetchData,

      // Filter
      avatarText,

      // UI
      resolveCustomerIsActiveStaffVariant,

      downloadExcelTable,
      printTable,
      onRowSelected,
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
