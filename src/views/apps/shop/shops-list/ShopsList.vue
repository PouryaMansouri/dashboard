<template>
  <div>
    <shop-list-add-new
      :is-add-new-shop-sidebar-active.sync="isAddNewShopSidebarActive"
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
                @click="isAddNewShopSidebarActive = true"
              >
                <span class="text-nowrap">Add Shop</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refShopListTable"
        id="refShopListTable"
        class="position-relative"
        :items="fetchShops"
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
        <template #cell(status)="data">
          <b-badge
            pill
            :variant="`light-${resolveShopStatusVariant(data.item.status)}`"
            class="text-capitalize"
          >
            {{ getStatus(data.item.status) }}
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
              :to="{ name: 'apps-shops-edit', params: { id: data.item.id } }"
            >
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>

            <b-dropdown-item>
              <feather-icon icon="TrashIcon" />
              <span @click="deleteShop(data.item.id)" class="align-middle ml-50"
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
              :total-rows="totalShops"
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
import useShopsList from "./useShopsList";
import shopStoreModule from "../shopStoreModule";
import ShopListAddNew from "./ShopListAddNew.vue";
import router from "@/router";

export default {
  components: {
    ShopListAddNew,

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
    getStatus(status) {
      if (status === 0) return "InActive";
      if (status === 1) return "Active";
      if (status === 2) return "Deleted";
    },
    deleteShop(id) {
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
          store.dispatch("app-shop/deleteShop", { id }).then((response) => {
            if (response.status == 200) {
              this.$swal({
                icon: "success",
                text: "Status Changed to Deleted",
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
    const Shop_APP_STORE_MODULE_NAME = "app-shop";

    // Register module
    if (!store.hasModule(Shop_APP_STORE_MODULE_NAME))
      store.registerModule(Shop_APP_STORE_MODULE_NAME, shopStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Shop_APP_STORE_MODULE_NAME))
        store.unregisterModule(Shop_APP_STORE_MODULE_NAME);
    });

    const isAddNewShopSidebarActive = ref(false);

    const onRowSelected = (item) => {
      router.push({
        name: "apps-shops-edit",
        params: { id: item[0].id },
      });
    };

    const {
      fetchShops,
      tableColumns,
      perPage,
      currentPage,
      totalShops,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refShopListTable,
      refetchData,
      resolveShopStatusVariant,
      downloadExcelTable,
      printTable,
      // UI
    } = useShopsList();

    return {
      // Sidebar
      isAddNewShopSidebarActive,

      fetchShops,
      tableColumns,
      perPage,
      currentPage,
      totalShops,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refShopListTable,
      refetchData,

      // Filter
      avatarText,
      resolveShopStatusVariant,
      downloadExcelTable,
      printTable,
      onRowSelected
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
