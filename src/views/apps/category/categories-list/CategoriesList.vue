<template>
  <div>
    <category-list-add-new
      :is-add-new-category-sidebar-active.sync="isAddNewCategorySidebarActive"
      :is-active-options="isActiveOptions"
      :is-deleted-options="isDeletedOptions"
      :is-navbar-options="isNavbarOptions"
      @refetch-data="refetchData"
    />

    <!-- Filters -->
    <categories-list-filters
      :is-active-filter.sync="isActiveFilter"
      :is-deleted-filter.sync="isDeletedFilter"
      :is-navbar-filter.sync="isNavbarFilter"
      :is-active-options="isActiveOptions"
      :is-deleted-options="isDeletedOptions"
      :is-navbar-options="isNavbarOptions"
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
                @click="isAddNewCategorySidebarActive = true"
              >
                <span class="text-nowrap">Add Category</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refCategoryListTable"
        class="position-relative"
        :items="fetchCategories"
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

        <template #cell(is_navbar)="data">
          <b-badge
            pill
            :variant="`light-${resolveTrueFalseVariant(data.item.is_navbar)}`"
            class="text-capitalize"
          >
            {{ data.item.is_navbar == true ? "Navbar" : "NotNavbar" }}
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
                name: 'apps-categories-edit',
                params: { id: data.item.id },
              }"
            >
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>

            <b-dropdown-item>
              <feather-icon icon="TrashIcon" />
              <span
                @click="deleteCategory(data.item.id)"
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
              :total-rows="totalCategories"
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
import CategoriesListFilters from "./CategoriesListFilters.vue";
import useCategoriesList from "./useCategoriesList";
import categoryStoreModule from "../categoryStoreModule";
import CategoryListAddNew from "./CategoryListAddNew.vue";

export default {
  components: {
    CategoriesListFilters,
    CategoryListAddNew,

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
    deleteCategory(id) {
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
          store.dispatch("app-category/deleteCategory", { id }).then((response) => {
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
    const category_APP_STORE_MODULE_NAME = "app-category";

    // Register module
    if (!store.hasModule(category_APP_STORE_MODULE_NAME))
      store.registerModule(category_APP_STORE_MODULE_NAME, categoryStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(category_APP_STORE_MODULE_NAME))
        store.unregisterModule(category_APP_STORE_MODULE_NAME);
    });

    const isAddNewCategorySidebarActive = ref(false);

    const isActiveOptions = [
      { label: "Active", value: true },
      { label: "InActive", value: false },
    ];

    const isDeletedOptions = [
      { label: "Deleted", value: true },
      { label: "NotDeleted", value: false },
    ];

    const isNavbarOptions = [
      { label: "Navbar", value: true },
      { label: "NotNavbar", value: false },
    ];

    const {
      fetchCategories,
      tableColumns,
      perPage,
      currentPage,
      totalCategories,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refCategoryListTable,
      refetchData,

      // UI
      resolveTrueFalseVariant,

      // Extra Filters
      isActiveFilter,
      isDeletedFilter,
      isNavbarFilter,
    } = useCategoriesList();

    return {
      // Sidebar
      isAddNewCategorySidebarActive,

      fetchCategories,
      tableColumns,
      perPage,
      currentPage,
      totalCategories,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refCategoryListTable,
      refetchData,

      // Filter
      avatarText,

      // UI
      resolveTrueFalseVariant,

      isActiveOptions,
      isDeletedOptions,
      isNavbarOptions,

      // Extra Filters
      isActiveFilter,
      isDeletedFilter,
      isNavbarFilter,
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
