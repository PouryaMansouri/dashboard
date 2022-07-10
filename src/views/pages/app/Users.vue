<template>
  <b-row>
    <b-col cols="12">
      <b-card class="card shabnam-fd">
        <!-- search input -->
        <div class="custom-search d-flex justify-content-end">
          <b-form-group>
            <div class="d-flex align-items-center">
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                v-b-modal.modal-select2
                variant="outline-primary"
              >
                ثبت محصول
              </b-button>
            </div>
          </b-form-group>
        </div>
        <div class="custom-search d-flex justify-content-end">
          <b-form-group>
            <div class="d-flex align-items-center">
              <label class="mr-1">جستجو</label>
              <b-form-input
                v-model="searchTerm"
                placeholder="جستجو"
                type="text"
                class="d-inline-block"
              />
            </div>
          </b-form-group>
        </div>

        <!-- table -->
        <vue-good-table
          :columns="columns"
          :rows="rows"
          :rtl="direction"
          :search-options="{
            enabled: true,
            externalQuery: searchTerm,
          }"
          :select-options="{
            enabled: true,
            selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
            selectionInfoClass: 'custom-class',
            selectionText: 'rows selected',
            clearSelectionText: 'clear',
            disableSelectInfo: true, // disable the select info panel on top
            selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
          }"
          :pagination-options="{
            enabled: true,
            perPage: pageLength,
          }"
          @on-row-click="onRowClick"
        >
          <template slot="table-row" slot-scope="props">
            <!-- Column: Name -->
            <span v-if="props.column.field === 'fullName'" class="text-nowrap">
              <b-avatar :src="props.row.avatar" class="mx-1" />
              <span class="text-nowrap">{{ props.row.fullName }}</span>
            </span>

            <!-- Column: Status -->
            <span v-else-if="props.column.field === 'status'">
              <b-badge :variant="statusVariant(props.row.status)">
                {{ props.row.status }}
              </b-badge>
            </span>

            <!-- Column: Action -->
            <span v-else-if="props.column.field === 'action'">
              <span class="pr-1" @click="editClick">
                <feather-icon icon="Edit2Icon" class="mr-50" />
                <span>ویرایش</span>
              </span>
              <span @click="deleteClick">
                <feather-icon icon="TrashIcon" class="mr-50" />
                <span>حذف</span>
              </span>
            </span>

            <!-- Column: Common -->
            <span v-else>
              {{ props.formattedRow[props.column.field] }}
            </span>
          </template>

          <!-- pagination -->
          <template slot="pagination-bottom" slot-scope="props">
            <div class="d-flex justify-content-between flex-wrap">
              <div class="d-flex align-items-center mb-0 mt-1">
                <!-- <span class="text-nowrap ">
              Showing 1 to
            </span> -->
                <b-form-select
                  v-model="pageLength"
                  :options="['5', '10', '30']"
                  class="mx-1"
                  @input="
                    (value) => props.perPageChanged({ currentPerPage: value })
                  "
                />
                <!-- <span class="text-nowrap"> of {{ props.total }} entries </span> -->
              </div>
              <div>
                <b-pagination
                  :value="1"
                  :total-rows="props.total"
                  :per-page="pageLength"
                  first-number
                  last-number
                  align="right"
                  prev-class="prev-item"
                  next-class="next-item"
                  class="mt-1 mb-0"
                  @input="(value) => props.pageChanged({ currentPage: value })"
                >
                  <template #prev-text>
                    <feather-icon icon="ChevronLeftIcon" size="18" />
                  </template>
                  <template #next-text>
                    <feather-icon icon="ChevronRightIcon" size="18" />
                  </template>
                </b-pagination>
              </div>
            </div>
          </template>
        </vue-good-table>

        <b-modal
          id="modal-select2"
          title="ثبت کاربر"
          ok-title="ثبت"
          cancel-title="انصراف"
          cancel-variant="outline-secondary"
          content-class="shabnam-fd"
          @show="resetModal"
          @hidden="resetModal"
          @ok="handleOk"
        >
          <b-form @submit.stop.prevent="handleSubmit">
            <b-form-group label="نام" label-for="firstName">
              <b-form-input
                id="firstName"
                v-model="firstName"
                placeholder="نام"
              />
            </b-form-group>
            <b-form-group label="نام خانوادگی" label-for="lastName">
              <b-form-input
                id="lastName"
                v-model="lastName"
                placeholder="نام خانوادگی"
              />
            </b-form-group>
            <!-- <b-form-group label="Choose the country" label-for="vue-select">
              <v-select
                id="vue-select"
                v-model="selected"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="option"
              />
            </b-form-group> -->
          
            <b-form-group label="تلفن" label-for="phone">
              <b-form-input
                id="phone"
                v-model="phone"
                type="number"
                placeholder="تلفن"
              />
            </b-form-group>
            <b-form-group label="ایمیل" label-for="email">
              <b-form-input id="email" v-model="email" placeholder="ایمیل" />
            </b-form-group>
          </b-form>
        </b-modal>

        <b-modal
          id="modal-select3"
          title="ویرایش کاربر"
          ok-title="ویرایش"
          cancel-title="انصراف"
          cancel-variant="outline-secondary"
          content-class="shabnam-fd"
          @ok="handleOkEdit"
        >
          <b-form @submit.stop.prevent="handleSubmitEdit">
            <b-form-group label="نام" label-for="firstName">
              <b-form-input
                id="firstName"
                v-model="firstName"
                placeholder="نام"
              />
            </b-form-group>
            <b-form-group label="نام خانوادگی" label-for="lastName">
              <b-form-input
                id="lastName"
                v-model="lastName"
                placeholder="نام خانوادگی"
              />
            </b-form-group>
            <!-- <b-form-group label="Choose the country" label-for="vue-select">
              <v-select
                id="vue-select"
                v-model="selected"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="option"
              />
            </b-form-group> -->
           
            <b-form-group label="تلفن" label-for="phone">
              <b-form-input
                id="phone"
                v-model="phone"
                type="number"
                placeholder="تلفن"
              />
            </b-form-group>
            <b-form-group label="ایمیل" label-for="email">
              <b-form-input id="email" v-model="email" placeholder="ایمیل" />
            </b-form-group>
          </b-form>
        </b-modal>
      </b-card>
    </b-col>
  </b-row>
</template>

<style scoped>
.card {
  background-color: rgb(255, 255, 255);
  padding: 10px;
}
</style>
<script>
import {
  BButton,
  BModal,
  VBModal,
  BForm,
  BAvatar,
  BBadge,
  BPagination,
  BFormGroup,
  BFormInput,
  BFormSelect,
} from "bootstrap-vue";
import { VueGoodTable } from "vue-good-table";
import store from "@/store/index";
import Ripple from "vue-ripple-directive";
import { codeBasic } from "./code";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    VueGoodTable,
    BAvatar,
    BBadge,
    BPagination,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BButton,
    BModal,
    BForm,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      phone: null,
      email: null,
      pageLength: 5,
      dir: false,
      codeBasic,
      editFire: false,
      deleteFire: false,
      columns: [
        {
          label: "نام",
          field: "name",
        },
        {
          label: "شماره تلفن",
          field: "phone",
        },
        {
          label: "عملیات",
          field: "action",
        },
      ],
      rows: [],
      searchTerm: "",
      status: [
        {
          1: "Current",
          2: "Professional",
          3: "Rejected",
          4: "Resigned",
          5: "Applied",
        },
        {
          1: "light-primary",
          2: "light-success",
          3: "light-danger",
          4: "light-warning",
          5: "light-info",
        },
      ],
    };
  },
  computed: {
    statusVariant() {
      const statusColor = {
        /* eslint-disable key-spacing */
        Current: "light-primary",
        Professional: "light-success",
        Rejected: "light-danger",
        Resigned: "light-warning",
        Applied: "light-info",
        /* eslint-enable key-spacing */
      };

      return (status) => statusColor[status];
    },
    direction() {
      if (store.state.appConfig.isRTL) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dir = true;
        return this.dir;
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.dir = false;
      return this.dir;
    },
  },
  created() {
    this.fetchCoachs();
  },
  methods: {
    onRowClick(params) {
      const { id } = params.row;
      if (this.editFire) {
        this.editAction(params.row);
        this.editFire = false;
      }
      if (this.deleteFire) {
        this.deleteAction(id);
        this.deleteFire = false;
      }
    },
    fetchCoachs() {
      this.$http
        .get("coachs")
        .then((response) => {

          const users = response.data.map((a) => a.user); //array of coach ids

          this.rows = users;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    editClick() {
      this.editFire = true;
    },
    deleteClick() {
      this.deleteFire = true;
    },
    deleteAction(id) {
      this.$swal({
        title: "آیا از تصمیم خود مطمئنید؟",
        text: "راه برگشتی نیست :)))",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "بله",
        cancelButtonText: "مطمئن نیستم",
        customClass: {
          container: "shabnam-fd",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$http
            .delete(`users/${id}`)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: "حذف شد!",
                text: "کاربر با موفقیت حذف شد",
                confirmButtonText: "اوکی",
                customClass: {
                  container: "shabnam-fd",
                  confirmButton: "btn btn-primary",
                },
              });
              this.fetchCoachs();
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    },
    editAction(params) {
      this.id = params.id;
      this.firstName = params.firstName;
      this.lastName = params.lastName;
      this.phone = params.phone;
      this.email = params.email;
      this.$bvModal.show("modal-select3");
    },
    resetModal() {
      this.firstName = "";
      this.lastName = "";
      this.phone = null;
      this.email = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleOkEdit(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmitEdit();
    },
    handleSubmit() {
      this.$http
        .post("coachs", {
          firstName: this.firstName,
          lastName: this.lastName,
          phone: this.phone,
          email: this.email,
        })
        .then((response) => {
          this.fetchCoachs();
          this.$bvModal.hide("modal-select2");
        })
        .catch((e) => {
          let message = "";
          if (e.response.status == 500) {
            message = e.response.data.detail;
            if (message.includes("phone")) {
              this.showErrorMessage(
                "این شماره تلفن قبلا برای کاربر دیگر ثبت شده است"
              );
            } else if (message.includes("email")) {
              this.showErrorMessage(
                "این ایمیل قبلا برای کاربر دیگر ثبت شده است"
              );
            } else if (message.includes("username")) {
              this.showErrorMessage(
                "این نام کاربری قبلا برای کاربر دیگر ثبت شده است"
              );
            } else this.showErrorMessage("مجدد با داده های دقیقتر امتحان کنید");
          }
        });
    },
    handleSubmitEdit() {
      this.$http
        .put(`users/${this.id}`, {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
        })
        .then((response) => {
          this.fetchCoachs();
          this.$bvModal.hide("modal-select3");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    showErrorMessage(message) {
      this.$toast({
        component: ToastificationContent,
        position: "top-right",
        props: {
          title: "ایراد در اطلاعات ورودی",
          variant: "danger",
          text: message,
        },
      });
    },
  },
};
</script>

<style lang="scss" >
@import "@core/scss/vue/libs/vue-good-table.scss";
</style>
