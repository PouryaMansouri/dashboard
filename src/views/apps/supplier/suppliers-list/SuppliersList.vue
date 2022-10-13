<template>
  <div>
    <supplier-list-add-new
      :is-add-new-supplier-sidebar-active.sync="isAddNewSupplierSidebarActive"
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
                @click="isAddNewSupplierSidebarActive = true"
              >
                <span class="text-nowrap">Add Supplier</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refSupplierListTable"
        id="refSupplierListTable"
        class="position-relative"
        :items="fetchSuppliers"
        responsive
        hover
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
        <template #cell(show_details)="row">
          <b-button
            size="sm"
            variant="outline-secondary"
            @click="row.toggleDetails"
          >
            Details
          </b-button>
        </template>

        <template #row-details="row">
          <b-card>
            <b-row>
              <b-col md="4" class="mb-1">
                <strong>Address : </strong>{{ row.item.address }}
              </b-col>
              <b-col md="4" class="mb-1">
                <strong>Description : </strong>{{ row.item.description }}
              </b-col>
              <b-col md="4" class="mb-1">
                <strong>Phone : </strong>{{ row.item.phone }}
              </b-col>
              <b-col md="4" class="mb-1">
                <strong>Website : </strong>{{ row.item.website }}
              </b-col>
            </b-row>

            <b-button
              size="sm"
              variant="outline-secondary"
              @click="row.toggleDetails"
            >
              Hide Details
            </b-button>
          </b-card>
        </template>

        <template #cell(is_active)="data">
          <b-badge
            pill
            :variant="`light-${resolveTrueFalseVariant(data.item.is_active)}`"
            class="text-capitalize"
          >
            {{ data.item.is_active == true ? "Active" : "InActive" }}
          </b-badge>
        </template>

        <template #cell(supplier_type)="data">
          <b-badge pill class="text-capitalize">
            {{ resolveSupplierType(data.item.supplier_type) }}
          </b-badge>
        </template>

        <template #cell(work_type)="data">
          <b-badge pill class="text-capitalize">
            {{ resolveWorkType(data.item.work_type) }}
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
                supplier="16"
                class="align-middle text-body"
              />
            </template>
            <b-dropdown-item
              :to="{
                name: 'apps-suppliers-edit',
                params: { id: data.item.id },
              }"
            >
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>

            <b-dropdown-item
              :to="{
                name: 'apps-suppliers-history',
                params: { id: data.item.id },
              }"
            >
              <feather-icon icon="ClockIcon" />
              <span class="align-middle ml-50">History</span>
            </b-dropdown-item>

            <b-dropdown-item>
              <feather-icon icon="TrashIcon" />
              <span
                class="align-middle ml-50"
                @click="deleteSupplier(data.item.id)"
                >Delete</span
              >
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
              :total-rows="totalSuppliers"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" supplier="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" supplier="18" />
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
import useSuppliersList from "./useSuppliersList";
import supplierStoreModule from "../supplierStoreModule";
import SupplierListAddNew from "./SupplierListAddNew.vue";
import router from '@/router';

export default {
  components: {
    SupplierListAddNew,

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
  data() {
    return {
      selected,
    };
  },
  methods: {
    deleteSupplier(id) {
      this.$swal({
        title: "Accept Or Deny",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          store
            .dispatch("app-supplier/deleteSupplier", { id })
            .then((response) => {
              if (response.status == 200) {
                this.$swal({
                  icon: "success",
                  text: "Deleted",
                  confirmButtonText: "OK",
                  customClass: {
                    confirmButton: "btn btn-primary",
                  },
                });
                this.refetchData();
              } else {
                this.$toast({
                  component: ToastificationContent,
                  position: "top-right",
                  props: {
                    title: "Error",
                    variant: "danger",
                    text: "Error",
                  },
                });
              }
            });
        }
      });
    },
  },
  setup() {
    const supplier_APP_STORE_MODULE_NAME = "app-supplier";

    // Register module
    if (!store.hasModule(supplier_APP_STORE_MODULE_NAME))
      store.registerModule(supplier_APP_STORE_MODULE_NAME, supplierStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(supplier_APP_STORE_MODULE_NAME))
        store.unregisterModule(supplier_APP_STORE_MODULE_NAME);
    });

    const isAddNewSupplierSidebarActive = ref(false);

    const onRowSelected = (item) => {
      router.push({
        name: "apps-suppliers-edit",
        params: { id: item[0].id },
      });
    };

    const {
      fetchSuppliers,
      tableColumns,
      perPage,
      currentPage,
      totalSuppliers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refSupplierListTable,
      refetchData,

      // UI
      resolveTrueFalseVariant,
      resolveWorkType,
      resolveSupplierType,
      downloadExcelTable,
      printTable,
    } = useSuppliersList();

    return {
      onRowSelected,
      // Sidebar
      isAddNewSupplierSidebarActive,

      fetchSuppliers,
      tableColumns,
      perPage,
      currentPage,
      totalSuppliers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refSupplierListTable,
      refetchData,

      // Filter
      avatarText,

      // UI
      resolveTrueFalseVariant,
      resolveWorkType,
      resolveSupplierType,
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
.b-table-selectable {
  .feather {
    font-size: 1.3rem;
  }
}
</style>
