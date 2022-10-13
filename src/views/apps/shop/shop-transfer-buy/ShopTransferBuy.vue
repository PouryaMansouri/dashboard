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
        ref="refStockTransferTable"
        class="position-relative"
        :items="fetchTransfers"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
      >
        <template #cell(status)="data">
          <b-badge pill class="text-capitalize">
            {{ getStatus(data.item.status) }}
          </b-badge>
        </template>

        <template #cell(transfer_from_shop)="data">
          {{
            data.item.transfer_from_shop == null
              ? ""
              : data.item.transfer_from_shop.name
          }}
        </template>

        <template #cell(buy_from)="data">
          {{
            data.item.buy_from.name
          }}
        </template>

        <template #cell(transfer_to_shop)="data">
          {{
            data.item.transfer_to_shop == null
              ? ""
              : data.item.transfer_to_shop.name
          }}
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

            <b-dropdown-item @click="cancelTransfer(data.item.id)">
              <feather-icon icon="XIcon" />
              <span class="align-middle ml-50">Cancel</span>
            </b-dropdown-item>

            <b-dropdown-item @click="confirmTransfer(data.item.id)">
              <feather-icon icon="CheckIcon" />
              <span class="align-middle ml-50">Confirm</span>
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
              :total-rows="totalTransfer"
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
import useTransfersBuy from "./useTransfersBuy";
import shopStoreModule from "../shopStoreModule";

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
  methods: {
    cancelTransfer(id) {
      this.$swal({
        title: "Accept Or Deny",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Accept",
        cancelButtonText: "Deny",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          store
            .dispatch("app-stock/cancelTransfer", { id })
            .then((response) => {
              if (response.status == 204) {
                this.$swal({
                  icon: "success",
                  text: "Success",
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
    confirmTransfer(id) {
      this.$swal({
        title: "Accept Or Deny",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Accept",
        cancelButtonText: "Deny",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          store
            .dispatch("app-stock/confirmTransfer", {
              id,
              stockData: { status: 2 },
            })
            .then((response) => {
              if (response.status == 200) {
                this.$swal({
                  icon: "success",
                  text: "Success",
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
  props: ["shopId"],
  setup(props) {
    const resolveStatusVariant = (status) => {
      if (status == "Pending") return "warning";
      if (status == "Canceled") return "danger";
      if (status == "Transferred") return "success";
    };
    const getStatus = (status) => {
      if (status == 1) return "Pending";
      if (status == 0) return "Canceled";
      if (status == 2) return "Transferred";
    };
    const TRANSFER_APP_STORE_MODULE_NAME = "app-shop";

    // Transfer module
    if (!store.hasModule(TRANSFER_APP_STORE_MODULE_NAME))
      store.transferModule(TRANSFER_APP_STORE_MODULE_NAME, shopStoreModule);

    // UnTransfer on leave
    onUnmounted(() => {
      if (store.hasModule(TRANSFER_APP_STORE_MODULE_NAME))
        store.untransferModule(TRANSFER_APP_STORE_MODULE_NAME);
    });

    const {
      fetchTransfers,
      tableColumns,
      perPage,
      currentPage,
      totalTransfer,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refStockTransferTable,
      refetchData,

      // UI
    } = useTransfersBuy(props.shopId);

    return {
      getStatus,
      resolveStatusVariant,
      fetchTransfers,
      tableColumns,
      perPage,
      currentPage,
      totalTransfer,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refStockTransferTable,
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
