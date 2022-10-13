<template>
  <div>
    <b-row>
      <b-col cols="12" sm="12" md="8">
        <b-card no-body class="mb-0">
          <div class="m-2">
            <b-row>
              <b-col
                cols="12"
                md="6"
                class="
                  d-flex
                  align-items-center
                  justify-content-start
                  mb-1 mb-md-0
                "
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
            ref="refVerbalStockListTable"
            class="position-relative"
            :items="fetchVerbalStocks"
            responsive
            :fields="tableColumns"
            primary-key="id"
            :sort-by.sync="sortBy"
            show-empty
            empty-text="No matching records found"
            :sort-desc.sync="isSortDirDesc"
          >
            <template #cell(image)="data">
              <b-media vertical-align="center">
                <b-img
                  width="100"
                  :src="data.item.image"
                  :text="avatarText(data.item.product)"
                />
              </b-media>
            </template>

            <template #cell(count)="data">
              <div class="item-quantity">
                <b-form-spinbutton
                  @change="changeCount(data.item, data.item.id, $event)"
                  min="0"
                  :max="data.item.quantity"
                  size="sm"
                  class="ml-75"
                  inline
                />
              </div>
            </template>     
            
                   <template #cell(discount)="data">
              {{data.item.discount}}%
            </template>

            <template #cell(add)="data">
              <b-button @click="addToCart(data.item.id)"> ADD </b-button>
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
                  :total-rows="totalVerbalStocks"
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
      </b-col>
      <b-col cols="12" sm="8" md="4">
        <b-card>
          <div class="mb-5">
            <b-row>
              <b-col cols="12" md="6">
                <b-button
                  class="mb-1 mb-sm-0 mr-0 mr-sm-1"
                  v-b-modal.modal-finish-cart
                  variant="primary"
                >
                  Customer Step
                </b-button>
              </b-col>
              <b-col cols="12" md="6">
                <h3>${{ totalCart }}</h3>
              </b-col>
            </b-row>
          </div>
          <b-card
            v-for="cartItem in cart"
            :key="cartItem.id"
            class="ecommerce-card"
            no-body
          >
            <b-row>
              <b-col cols="3">
                <b-img width="50" :src="cartItem.stock.image" />
              </b-col>
              <b-col cols="3">
                <h6>
                  {{ cartItem.stock.product }}
                </h6>
              </b-col>
              <b-col cols="4">
                <b-form-spinbutton
                  v-model="cartItem.count"
                  @change="makeTotal"
                  min="1"
                  :max="cartItem.stock.quantity"
                  size="sm"
                  inline
                />
              </b-col>
              <b-col cols="2">
                <b-button variant="light" @click="removeFromCart(cartItem.id)">
                  <feather-icon icon="XIcon" />
                </b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-card>
      </b-col>
    </b-row>
    <b-modal
      hide-footer
      id="modal-finish-cart"
      scrollable
      title="Customer Step"
      size="lg"
      cancel-variant="outline-secondary"
    >
      <b-form class="list-view product-checkout">
        <!-- Left Form -->
        <b-card no-body>
          <b-row>
            <b-col cols="12">
              <b-form-group label="Search" class="mb-2">
                <b-form-input
                  id="search"
                  @update="searchUsersFunc"
                  v-model="searchUserInput"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" md="6">
              <validation-provider
                #default="validationContext"
                name="Email"
                rules="required|email"
              >
                <b-form-group
                  label="Email"
                  label-for="customer_email"
                  class="mb-2"
                >
                  <b-form-input
                    id="customer_email"
                    v-model="user.email"
                    :state="getValidationState(validationContext)"
                    trim
                  />
                  <b-form-invalid-feedback>
                    {{ validationContext.errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
            <b-col cols="12" md="6">
              <b-form-group
                label="First Name"
                label-for="customer_first_name"
                class="mb-2"
              >
                <b-form-input
                  id="customer_first_name"
                  v-model="user.first_name"
                  trim
                />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="6">
              <b-form-group
                label="Last Name"
                label-for="customer_last_name"
                class="mb-2"
              >
                <b-form-input
                  id="customer_last_name"
                  v-model="user.last_name"
                  trim
                />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="6">
              <b-form-group
                label="Phone"
                label-for="customer_phone"
                class="mb-2"
              >
                <b-form-input
                  id="customer_phone"
                  v-model="user.phone_number"
                  trim
                />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="6">
              <b-form-group
                label="Referral Code"
                label-for="referral_code"
                class="mb-2"
              >
                <b-form-input
                  id="referral_code"
                  v-model="verbal.referral_code"
                  trim
                />
              </b-form-group>
            </b-col>
          </b-row>

          <b-row>
            <b-col cols="12" md="4">
              <b-button
                v-b-modal.modal-order
                @click="finish"
                variant="primary"
                class="mb-1 mb-sm-0 mr-0 mr-sm-1"
              >
                Finish
              </b-button>
            </b-col>
            <b-col cols="12" md="4">
              <b-button
                @click="addCustomer"
                variant="secondary"
                class="mb-1 mb-sm-0 mr-0 mr-sm-1"
              >
                Add Customer
              </b-button>
            </b-col>
            <b-col cols="12" md="4">
              <b-button
                @click="editCustomer"
                variant="secondary"
                class="mb-1 mb-sm-0 mr-0 mr-sm-1"
              >
                Edit Customer
              </b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-form>
      <b-table
        :items="searchUsers"
        :fields="['first_name', 'last_name', 'email', 'phone_number']"
        responsive
        select-mode="single"
        @row-selected="onRowSelected"
        selectable
      >
      </b-table>
    </b-modal>

    <b-modal
      hide-footer
      id="modal-order"
      scrollable
      title="order"
      size="xl"
      cancel-variant="outline-secondary"
    >
      <verbal-preview :verbal="invoice"></verbal-preview>
    </b-modal>
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
  BFormSpinbutton,
  BImg,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BModal,
  VBModal,
  BFormGroup,
  BForm,
  BFormInvalidFeedback,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import useVerbal from "./useVerbal";
import verbalStoreModule from "../verbalStoreModule";
import VerbalPreview from "../verbal-preview/VerbalPreview.vue";
import router from "@/router";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, alphaNum, email } from "@validations";
import formValidation from "@core/comp-functions/forms/form-validation";

export default {
  directives: {
    "b-modal": VBModal,
  },
  components: {
    BFormGroup,
    BModal,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BFormSpinbutton,
    BImg,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BForm,
    VerbalPreview,
    vSelect,
    BFormInvalidFeedback,
    ValidationProvider,
    ValidationObserver,
  },
  computed: {},
  methods: {
    makeTotals() {
      this.verbal.totals.final_price = 0;
      this.verbal.totals.total_discount = 0;
      this.verbal.totals.total_price = 0;

      this.cart.forEach((element) => {
        this.verbal.totals.total_price +=
          element.stock.price_without_discount * element.count;

        this.verbal.totals.final_price += element.stock.price * element.count;
      });

      this.verbal.totals.total_discount =
        this.verbal.totals.total_price - this.verbal.totals.final_price;
    },
    finish() {
      const a = this.cart.map((item) => {
        return {
          stock: item.id,
          quantity: item.count,
        };
      });

      this.verbal.order_items = [...a];
      this.verbal.cart = this.cart;

      this.makeTotals();

      this.invoice = this.verbal;

      // store
      //   .dispatch("app-verbal/addVerbal", this.verbal)
      //   .then((response) => {
      //     if (response.status == 201) {
      //       this.invoice = response.data;
      //     }
      //   })
      //   .catch((error) => {});
    },
  },
  data() {
    return {
      required,
      alphaNum,
      email,
      invoice: {},
    };
  },
  setup() {
    const shopId = ref(router.currentRoute.params.id);

    const VERBAL_APP_STORE_MODULE_NAME = "app-verbal";

    // Register module
    if (!store.hasModule(VERBAL_APP_STORE_MODULE_NAME))
      store.registerModule(VERBAL_APP_STORE_MODULE_NAME, verbalStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(VERBAL_APP_STORE_MODULE_NAME))
        store.unregisterModule(VERBAL_APP_STORE_MODULE_NAME);
    });

    const emptyVerbal = {
      shop: shopId,
      order_items: [],
      referral_code: "",
      customer: 0,
      cart: [],
      totals: {
        total_price: 0,
        total_discount: 0,
        final_price: 0,
      },
    };

    const user = ref({});

    const totalCart = ref(0);
    const verbal = ref(emptyVerbal);
    const verbalStockList = ref(false);
    const stocks = ref([]);
    const cart = ref([]);
    const searchUsers = ref([]);
    const searchUserInput = ref("");

    const makeTotal = () => {
      let res = 0;
      cart.value.forEach((element) => {
        const a = element.stock.price * element.count;
        res += a;
      });
      totalCart.value = res;
    };

    const changeCount = (stock, id, e) => {
      const obj = { id, count: e, stock };
      const allExept = stocks.value.filter((item) => item.id != id);
      if (e != 0) {
        stocks.value = [...allExept, obj];
      } else stocks.value = [...allExept];
    };

    const addToCart = (id) => {
      const fetch = stocks.value.filter((item) => item.id == id);
      if (fetch.length == 0) return;

      const stock = fetch[0];

      if (cart.value.filter((item) => item.id == id).length == 0) {
        cart.value = [...cart.value, stock];
      } else {
        const oldStock = cart.value.filter((item) => item.id == id)[0];
        oldStock.count = oldStock.count + stock.count;
        const allExept = cart.value.filter((item) => item.id != id);
        cart.value = [...allExept, oldStock];
      }
      makeTotal();
    };

    const removeFromCart = (id) => {
      const newCart = cart.value.filter((item) => item.id != id);

      cart.value = newCart;

      makeTotal();
    };

    const searchUsersFunc = () => {
      store
        .dispatch("app-user/fetchUsersVerbal", {
          q: searchUserInput.value,
        })
        .then((response) => {
          const { data, total } = response;
          searchUsers.value = data;
        })
        .catch(() => {});
    };

    const addCustomer = () => {
      store
        .dispatch("app-user/addUser", {
          email: user.value.email,
          first_name: user.value.first_name,
          last_name: user.value.last_name,
          phone_number: user.value.phone_number,
          password: "1234",
        })
        .then((response) => {
          const { data } = response;
          verbal.value.customer = data.data.id;
        })
        .catch(() => {});
    };

    const editCustomer = () => {
      store
        .dispatch("app-user/editUser", {
          id: user.value.id,
          userData: user.value,
        })
        .then((response) => {
        })
        .catch(() => {});
    };

    searchUsersFunc();

    const onRowSelected = (item) => {
      const obj = item[0];
      user.value = obj;
      verbal.value.customer = obj.id;
    };

    const resetuserData = () => {
      userData.value = JSON.parse(JSON.stringify(emptyVerbal));
    };

    const { refFormObserver, getValidationState, resetForm } =
      formValidation(resetuserData);

    const {
      fetchVerbalStocks,
      tableColumns,
      perPage,
      currentPage,
      totalVerbalStocks,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refVerbalStockListTable,
      refetchData,
    } = useVerbal(shopId.value);

    return {
      user,
      addCustomer,
      editCustomer,
      searchUsersFunc,
      searchUserInput,
      searchUsers,
      onRowSelected,
      shopId,
      makeTotal,
      totalCart,
      verbal,
      removeFromCart,
      addToCart,
      cart,
      changeCount,
      stocks,
      verbalStockList,
      // Sidebar

      fetchVerbalStocks,
      tableColumns,
      perPage,
      currentPage,
      totalVerbalStocks,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refVerbalStockListTable,
      refetchData,
      // Filter
      avatarText,
      refFormObserver,
      getValidationState,
      resetForm,
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
