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
        ref="refAffiliateAccountsListTable"
        id="refAffiliateAccountsListTable"
        class="position-relative"
        :items="fetchAffiliateAccounts"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
      >
        <template #row-details="row">
          <b-card>
            <b-row>Trx Req:</b-row>
            <b-row class="mb-2">
              <b-table
                striped
                small
                hover
                :items="row.item.transaction_requests"
                :fields="[
                  'id',
                  'amount',
                  'status',
                  'created_at',
                  'updated_at',
                  'actions',
                ]"
              >
                <template #cell(status)="data">
                  <b-badge pill class="text-capitalize">
                    {{ statusDetail(data.item.status) }}
                  </b-badge>
                </template>

                <template #cell(created_at)="data">
                  {{ new Date(data.item.created_at) }}
                </template>

                <template #cell(updated_at)="data">
                  {{ new Date(data.item.updated_at) }}
                </template>

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
                    <b-dropdown-item>
                      <feather-icon icon="CheckIcon" />
                      <span
                        @click="statusUpdateTrx(data.item.id, 1)"
                        class="align-middle ml-50"
                        >Approve</span
                      >
                    </b-dropdown-item>

                    <b-dropdown-item>
                      <feather-icon icon="XIcon" />
                      <span
                        @click="statusUpdateTrx(data.item.id, 2)"
                        class="align-middle ml-50"
                        >Reject</span
                      >
                    </b-dropdown-item>
                  </b-dropdown>
                </template>
              </b-table>
            </b-row>
            <b-button
              size="sm"
              variant="outline-secondary"
              @click="row.toggleDetails"
            >
              Hide Stocks
            </b-button>
          </b-card>
        </template>

        <template #cell(transactions_req)="row">
          <div>
            <b-button variant="outline-secondary" @click="row.toggleDetails">
              Trx Req
            </b-button>
          </div>
        </template>

        <template #cell(status)="data">
          <b-badge pill class="text-capitalize">
            {{ resolveStatusVariant(data.item.status) }}
          </b-badge>
        </template>

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
            <b-dropdown-item>
              <feather-icon icon="CheckIcon" />
              <span
                @click="statusUpdate(data.item.id, 1)"
                class="align-middle ml-50"
                >Active</span
              >
            </b-dropdown-item>

            <b-dropdown-item>
              <feather-icon icon="XIcon" />
              <span
                @click="statusUpdate(data.item.id, 2)"
                class="align-middle ml-50"
                >DeActive</span
              >
            </b-dropdown-item>
          </b-dropdown>
        </template>

        <template #cell(affiliateAccount_type)="data">
          <b-badge
            pill
            :variant="`light-${
              data.item.affiliateAccount_type == 1 ? 'success' : 'danger'
            }`"
            class="text-capitalize"
          >
            {{ data.item.affiliateAccount_type == 1 ? "Online" : "Offline" }}
          </b-badge>
        </template>

        <template #cell(user)="data">
          {{ data.item.user.first_name + " " + data.item.user.last_name }}
        </template>

        <template #cell(name)="data">
          {{ data.item.first_name + " " + data.item.last_name }}
        </template>

        <template #cell(updated_at)="data">
          {{ new Date(data.item.updated_at) }}
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
              :total-rows="totalAffiliateAccounts"
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
import useAffiliateAccountsList from "./useAffiliateAccountsList";
import affiliateStoreModule from "../affiliateStoreModule";

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
    resolveStatusVariant(status) {
      if (status == 0) return "Pending";
      if (status == 1) return "Active";
      if (status == 2) return "InActive";
      return "";
    },
    statusDetail(status) {
      if (status == 0) return "Pending";
      if (status == 1) return "Approve";
      if (status == 2) return "Reject";
      return "";
    },
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
            .dispatch("app-affiliate/changeStatusAffiliateAccounts", {
              id,
              status,
            })
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
            });
        }
      });
    },
    statusUpdateTrx(id, status) {
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
            .dispatch("app-affiliate/changeStatusAffiliateTrx", {
              id,
              status,
            })
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
            });
        }
      });
    },
  },
  setup() {
    const Affiliate_APP_STORE_MODULE_NAME = "app-affiliate";

    // Register module
    if (!store.hasModule(Affiliate_APP_STORE_MODULE_NAME))
      store.registerModule(
        Affiliate_APP_STORE_MODULE_NAME,
        affiliateStoreModule
      );

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Affiliate_APP_STORE_MODULE_NAME))
        store.unregisterModule(Affiliate_APP_STORE_MODULE_NAME);
    });

    const {
      fetchAffiliateAccounts,
      tableColumns,
      perPage,
      currentPage,
      totalAffiliateAccounts,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refAffiliateAccountsListTable,
      refetchData,
      downloadExcelTable,
      printTable,
    } = useAffiliateAccountsList();

    return {
      // Sidebar
      fetchAffiliateAccounts,
      tableColumns,
      perPage,
      currentPage,
      totalAffiliateAccounts,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refAffiliateAccountsListTable,
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
