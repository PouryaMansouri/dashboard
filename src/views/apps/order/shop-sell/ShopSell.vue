<template>
  <b-card no-body class="mb-0">
    <b-row>
      <b-col cols="12">
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
    <b-table
      ref="refOrderListPendingTable"
      id="refOrderListPendingTable"
      class="position-relative"
      :items="fetchShopSells"
      responsive
      :fields="tableColumns"
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
    >
      <template #cell(delivery_status)="data">
        <b-badge pill class="text-capitalize">
          {{ resolveStatusVariant(data.item.delivery_status) }}
        </b-badge>
      </template>

      <!-- Column: Actions -->
      <template #cell(actions)="data">
        <b-dropdown
          variant="link"
          no-caret
          dropup
          :right="$store.state.appConfig.isRTL"
        >
          <template #button-content>
            <feather-icon
              icon="MoreVerticalIcon"
              order="16"
              class="align-middle text-body"
            />
          </template>
          <b-dropdown-item>
            <b-button-toolbar>
              <b-button-group size="sm">
                <b-button
                  @click="statusUpdate(data.item.id, 0)"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="primary"
                >
                  PENDING
                </b-button>
                <b-button
                  @click="statusUpdate(data.item.id, 1)"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="primary"
                >
                  PROCESSING
                </b-button>
                <b-button
                  @click="statusUpdate(data.item.id, 2)"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="primary"
                >
                  DELIVERED
                </b-button>
                <b-button
                  @click="statusUpdate(data.item.id, 3)"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="primary"
                >
                  CANCELED
                </b-button>
              </b-button-group>
            </b-button-toolbar>
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
            :total-rows="totalOrders"
            :per-page="perPage"
            first-number
            last-number
            class="mb-0 mt-1 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
          >
            <template #prev-text>
              <feather-icon icon="ChevronLeftIcon" order="18" />
            </template>
            <template #next-text>
              <feather-icon icon="ChevronRightIcon" order="18" />
            </template>
          </b-pagination>
        </b-col>
      </b-row>
    </div>
  </b-card>
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
  BButtonToolbar,
  BButtonGroup,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import useOrdersListPending from "./useOrdersListPending";
import orderStoreModule from "../orderStoreModule";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

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

    BButtonToolbar,
    BButtonGroup,

    vSelect,
  },
  props: ["shopId"],
  methods: {
    statusUpdate(id, status) {
      this.$swal({
        title: "Accept Or Deny",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ok",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          store
            .dispatch("app-order/changeStatusOrder", { id, status })
            .then((response) => {
              if (response.status == 200) {
                this.$swal({
                  icon: "success",
                  text: "Approved",
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
            })
            .catch((error) => {
              if (error.response.status == 404) {
                this.$toast({
                  component: ToastificationContent,
                  position: "top-right",
                  props: {
                    title: "Error",
                    variant: "danger",
                    text: "Order delivered, You can't change status.",
                  },
                });
              }
            });
        }
      });
    },
  },
  setup(props) {
    const order_APP_STORE_MODULE_NAME = "app-order";

    // Register module
    if (!store.hasModule(order_APP_STORE_MODULE_NAME))
      store.registerModule(order_APP_STORE_MODULE_NAME, orderStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(order_APP_STORE_MODULE_NAME))
        store.unregisterModule(order_APP_STORE_MODULE_NAME);
    });

    const {
      fetchShopSells,
      tableColumns,
      perPage,
      currentPage,
      totalOrders,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refOrderListPendingTable,
      refetchData,

      // UI
      resolveStatusVariant,
      downloadExcelTable,
      printTable,
    } = useOrdersListPending(props.shopId);

    return {
      // Sidebar
      fetchShopSells,
      tableColumns,
      perPage,
      currentPage,
      totalOrders,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refOrderListPendingTable,
      refetchData,

      // Filter
      avatarText,

      // UI
      resolveStatusVariant,
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
