<template>
  <div>
    <brand-list-add-new
      :is-add-new-brand-sidebar-active.sync="isAddNewBrandSidebarActive"
      :is-active-options="isActiveOptions"
      :is-deleted-options="isDeletedOptions"
      @refetch-data="refetchData"
    />

    <!-- Filters -->
    <brands-list-filters
      :is-active-filter.sync="isActiveFilter"
      :is-deleted-filter.sync="isDeletedFilter"
      :is-active-options="isActiveOptions"
      :is-deleted-options="isDeletedOptions"
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
                @click="isAddNewBrandSidebarActive = true"
              >
                <span class="text-nowrap">Add Brand</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refBrandListTable"
        class="position-relative"
        :items="fetchBrands"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
      >
        <template #cell(is_active)="data">
          <b-badge
            pill
            :variant="`light-${resolveTrueFalseVariant(data.item.is_active)}`"
            class="text-capitalize"
          >
            {{ data.item.is_active == true ? "Active" : "Inactive" }}
          </b-badge>
        </template>

        <template #cell(is_deleted)="data">
          <b-badge
            pill
            :variant="`light-${resolveTrueFalseVariant(data.item.is_deleted)}`"
            class="text-capitalize"
          >
            {{ data.item.is_deleted == true ? "Deleted" : "NotDeleted" }}
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
            <!-- <b-dropdown-item
              :to="{ name: 'apps-brands-view', params: { id: data.item.id } }"
            >
              <feather-icon icon="FileTextIcon" />
              <span class="align-middle ml-50">Details</span>
            </b-dropdown-item> -->
            <b-dropdown-item
              :to="{ name: 'apps-brands-edit', params: { id: data.item.id } }"
            >
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>

            <b-dropdown-item>
              <feather-icon icon="TrashIcon" />
              <span
                @click="deleteBrand(data.item.id)"
                class="align-middle ml-50"
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
              :total-rows="totalBrands"
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
import BrandsListFilters from "./BrandsListFilters.vue";
import useBrandsList from "./useBrandsList";
import brandStoreModule from "../brandStoreModule";
import BrandListAddNew from "./BrandListAddNew.vue";

export default {
  components: {
    BrandsListFilters,
    BrandListAddNew,

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
    deleteBrand(id) {
      this.$swal({
        title: "Accept Or Deny",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Remove",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          store.dispatch("app-brand/deleteBrand", { id }).then((response) => {
            if (response.status == 204) {
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
    const brand_APP_STORE_MODULE_NAME = "app-brand";

    // Register module
    if (!store.hasModule(brand_APP_STORE_MODULE_NAME))
      store.registerModule(brand_APP_STORE_MODULE_NAME, brandStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(brand_APP_STORE_MODULE_NAME))
        store.unregisterModule(brand_APP_STORE_MODULE_NAME);
    });

    const isAddNewBrandSidebarActive = ref(false);

    const isActiveOptions = [
      { label: "Active", value: true },
      { label: "InActive", value: false },
    ];

    const isDeletedOptions = [
      { label: "Deleted", value: true },
      { label: "NotDeleted", value: false },
    ];

    const {
      fetchBrands,
      tableColumns,
      perPage,
      currentPage,
      totalBrands,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refBrandListTable,
      refetchData,

      // UI
      resolveTrueFalseVariant,

      // Extra Filters
      isActiveFilter,
      isDeletedFilter,
    } = useBrandsList();

    return {
      // Sidebar
      isAddNewBrandSidebarActive,

      fetchBrands,
      tableColumns,
      perPage,
      currentPage,
      totalBrands,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refBrandListTable,
      refetchData,

      // Filter
      avatarText,

      // UI
      resolveTrueFalseVariant,

      isActiveOptions,
      isDeletedOptions,

      // Extra Filters
      isActiveFilter,
      isDeletedFilter,
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
