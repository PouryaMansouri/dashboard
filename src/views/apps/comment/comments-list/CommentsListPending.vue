<template>
  <b-card no-body class="mb-0">
    <b-table
      ref="refCommentListTable"
      class="position-relative"
      :items="fetchCommentsPending"
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

      <template #cell(user)="data">
        <b-media vertical-align="center">
          <template #aside>
            <b-avatar
              size="32"
              :src="data.item.avatar"
              :to="{ name: 'apps-users-view', params: { id: data.item.user } }"
            />
          </template>
          <b-link
            :to="{ name: 'apps-users-view', params: { id: data.item.user } }"
            class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item.nickname }}
          </b-link>
        </b-media>
      </template>

      <template #cell(rate)="data">
        <b-badge pill class="text-capitalize">
          {{ getRate(data.item.rate) }}
        </b-badge>
      </template>

      <template #cell(created_at)="data">
          {{ new Date(data.item.created_at) }}
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
              comment="16"
              class="align-middle text-body"
            />
          </template>
          <b-dropdown-item>
            <feather-icon icon="CheckIcon" />
            <span
              class="align-middle ml-50"
              @click="approveComment(data.item.id)"
              >Approve</span
            >
          </b-dropdown-item>
          <b-dropdown-item>
            <feather-icon icon="XIcon" />
            <span
              class="align-middle ml-50"
              @click="rejectComment(data.item.id)"
              >Reject</span
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
            :total-rows="totalComments"
            :per-page="perPage"
            first-number
            last-number
            class="mb-0 mt-1 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
          >
            <template #prev-text>
              <feather-icon icon="ChevronLeftIcon" comment="18" />
            </template>
            <template #next-text>
              <feather-icon icon="ChevronRightIcon" comment="18" />
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
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import useCommentsList from "./useCommentsList";
import commentStoreModule from "../commentStoreModule";

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
    getStatus(status) {
      if (status == 1) return "Pending";
      if (status == 2) return "Approve";
      if (status == 3) return "Reject";
      return "";
    },
    getRate(rate) {
      if (rate == 1) return "Very Bad";
      if (rate == 2) return "Bad";
      if (rate == 3) return "Good";
      if (rate == 4) return "Very Good";
      if (rate == 5) return "Excellent";
      return "";
    },
    approveComment(id) {
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
            .dispatch("app-comment/approveComment", { id })
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
    rejectComment(id) {
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
            .dispatch("app-comment/rejectComment", { id })
            .then((response) => {
              if (response.status == 200) {
                this.$swal({
                  icon: "success",
                  text: "Rejected",
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
    const comment_APP_STORE_MODULE_NAME = "app-comment";

    // Register module
    if (!store.hasModule(comment_APP_STORE_MODULE_NAME))
      store.registerModule(comment_APP_STORE_MODULE_NAME, commentStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(comment_APP_STORE_MODULE_NAME))
        store.unregisterModule(comment_APP_STORE_MODULE_NAME);
    });

    const {
      fetchCommentsPending,
      tableColumns,
      perPage,
      currentPage,
      totalComments,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refCommentListTable,
      refetchData,

      // UI
    } = useCommentsList("");

    return {
      // Sidebar
      fetchCommentsPending,
      tableColumns,
      perPage,
      currentPage,
      totalComments,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refCommentListTable,
      refetchData,

      // Filter
      avatarText,

      // UI
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
