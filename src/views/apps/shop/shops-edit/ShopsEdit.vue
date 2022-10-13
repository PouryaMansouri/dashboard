<template>
  <div v-if="shopData">
    <b-alert variant="danger" :show="shopData === undefined">
      <h4 class="alert-heading">Error fetching shop data</h4>
      <div class="alert-body">
        No shop found with this shop id. Check for other shops.
      </div>
    </b-alert>
    <b-card>
      <b-card-header>
        <h3>Shop Name: {{ shopData.name }}</h3>
      </b-card-header>
      <b-row class="match-height">
        <b-col lg="4" md="6">
          <shop-numbers :data="cols.col1" />
        </b-col>

        <b-col lg="4" md="6">
          <shop-numbers :data="cols.col2" />
        </b-col>

        <b-col lg="4" md="6">
          <shop-numbers :data="cols.col3" />
        </b-col>
      </b-row>
    </b-card>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Edit">
        <shop-edit-tab :shop-data="shopData" class="mt-2 pt-75" />
      </app-collapse-item>
    </app-collapse>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Products">
        <shop-products :shopId="shopData.id" class="mt-2 pt-75" />
      </app-collapse-item>
    </app-collapse>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Staff">
        <shop-staff :shopId="shopData.id" />
      </app-collapse-item>
    </app-collapse>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Stock">
        <shop-stocks :shopId="shopData.id" />
      </app-collapse-item>
    </app-collapse>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Transfer All">
        <shop-transfer-all :shopId="shopData.id" />
      </app-collapse-item>
    </app-collapse>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Transfer Pending">
        <shop-transfer-pending :shopId="shopData.id" />
      </app-collapse-item>
    </app-collapse>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Buy">
        <shop-transfer-buy :shopId="shopData.id" />
      </app-collapse-item>
    </app-collapse>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Sell">
        <shop-sell :shopId="shopData.id" />
      </app-collapse-item>
    </app-collapse>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Log">
        <shop-logs :shopId="shopData.id" />
      </app-collapse-item>
    </app-collapse>
  </div>
</template>

<script>
import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";
import {
  BRow,
  BCol,
  BTab,
  BTabs,
  BCard,
  BAlert,
  BLink,
  BAvatar,
  BCardHeader,
  BImg,
  BCardTitle,
  BCardBody,
  BMediaBody,
  BMedia,
  BMediaAside,
  BDropdown,
  BDropdownItem,
} from "bootstrap-vue";
import { ref, onUnmounted } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";
import shopStoreModule from "../shopStoreModule";
import ShopEditTab from "./ShopEditTab.vue";
import ShopNumbers from "./ShopNumbers.vue";
import ShopProducts from "@views/apps/product/shop-products/ShopProducts.vue";
import ShopStaff from "@views/apps/user/shop-staff/ShopStaff.vue";
import ShopSell from "@views/apps/order/shop-sell/ShopSell.vue";
import ShopLogs from "@views/apps/log/shop-logs/ShopLogs.vue";
import ShopStocks from "@views/apps/stock/shop-stocks/ShopStocks.vue";
import ShopTransferAll from "../shop-transfer-all/ShopTransferAll.vue";
import ShopTransferPending from "../shop-transfer-pending/ShopTransferPending.vue";
import ShopTransferBuy from "../shop-transfer-buy/ShopTransferBuy.vue";

export default {
  components: {
    BRow,
    BCol,
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    ShopEditTab,
    AppCollapse,
    AppCollapseItem,
    BAvatar,
    BCardHeader,
    BImg,
    ShopNumbers,
    BCardTitle,
    BCardBody,
    BMediaBody,
    BMedia,
    BMediaAside,
    BDropdown,
    BDropdownItem,
    ShopProducts,
    ShopStaff,
    ShopSell,
    ShopLogs,
    ShopStocks,
    ShopTransferAll,
    ShopTransferPending,
    ShopTransferBuy,
  },
  setup() {
    const shopData = ref(null);

    const cols = ref({
      col1: [],
      col2: [],
      col3: [],
    });

    const Shop_APP_STORE_MODULE_NAME = "app-shop";

    // Register module
    if (!store.hasModule(Shop_APP_STORE_MODULE_NAME))
      store.registerModule(Shop_APP_STORE_MODULE_NAME, shopStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Shop_APP_STORE_MODULE_NAME))
        store.unregisterModule(Shop_APP_STORE_MODULE_NAME);
    });

    const makeDetailCols = () => {
      const totals = shopData.value;
      cols.value.col1 = [
        {
          mode: "Purchases Times",
          types: "Starbucks",
          avatar: "TrendingUpIcon",
          avatarVariant: "light-info",
          payment: `${totals.total_purchases_times}`,
          deduction: false,
        },
        {
          mode: "Purchases Price",
          types: "Add Money",
          avatar: "DollarSignIcon",
          avatarVariant: "light-success",
          payment: `$${totals.total_purchases_price}`,
          deduction: false,
        },
        {
          mode: "Purchases Stocks",
          types: "Add Money",
          avatar: "TrendingUpIcon",
          avatarVariant: "light-info",
          payment: `${totals.total_purchases_stocks}`,
          deduction: false,
        },
        {
          mode: "Purchases Times Per Month",
          types: "Ordered Food",
          avatar: "TrendingUpIcon",
          avatarVariant: "light-info",
          payment: `${totals.total_purchases_times_per_month}`,
          deduction: false,
        },
        {
          mode: "Purchases Stocks Per Month",
          types: "Refund",
          avatar: "TrendingUpIcon",
          avatarVariant: "light-info",
          payment: `${totals.total_purchases_stocks_per_month}`,
          deduction: false,
        },
      ];
      cols.value.col2 = [
        {
          mode: "Sell Offline Price",
          types: "Starbucks",
          avatar: "DollarSignIcon",
          avatarVariant: "light-success",
          payment: `$${totals.total_sell_offline_price}`,
          deduction: false,
        },
        {
          mode: "Sell Offline Price Per Month",
          types: "Add Money",
          avatar: "DollarSignIcon",
          avatarVariant: "light-success",
          payment: `$${totals.total_sell_offline_price_per_month}`,
          deduction: false,
        },
        {
          mode: "Sell Online Price",
          types: "Add Money",
          avatar: "DollarSignIcon",
          avatarVariant: "light-success",
          payment: `$${totals.total_sell_online_price}`,
          deduction: false,
        },
        {
          mode: "Sell Online Price Per Month",
          types: "Ordered Food",
          avatar: "DollarSignIcon",
          avatarVariant: "light-success",
          payment: `$${totals.total_sell_online_price_per_month}`,
          deduction: false,
        },
      ];
      cols.value.col3 = [
        {
          mode: "Staff Count",
          types: "Starbucks",
          avatar: "TrendingUpIcon",
          avatarVariant: "light-info",
          payment: `${totals.staff_count}`,
          deduction: false,
        },
        {
          mode: "Shop Balance",
          types: "Add Money",
          avatar: "DollarSignIcon",
          avatarVariant: "light-success",
          payment: `$${totals.shop_balance}`,
          deduction: totals.shop_balance <= 0 ? true : false,
        },
      ];
    };

    store
      .dispatch("app-shop/fetchShop", { id: router.currentRoute.params.id })
      .then((response) => {
        shopData.value = response.data;
        makeDetailCols();
        const a = shopData.value.staffs;
        const s = a.map((item) => {
          return {
            text: item.first_name + " " + item.last_name,
            email: item.email,
            value: item.id,
          };
        });

        shopData.value.staffs = s;
        shopData.value.owner = {
          text:
            shopData.value.owner.first_name +
            " " +
            shopData.value.owner.last_name,
          value: shopData.value.owner.id,
        };
      })
      .catch((error) => {
        if (error.response.status === 404) {
          shopData.value = undefined;
        }
      });

    return {
      shopData,
      cols,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/dashboard-ecommerce.scss";
</style>

<style  scoped>
.image {
  position: relative;
}

.text-overlay {
  position: absolute;
  padding: 1rem;
  font-size: 3rem;
  font-weight: 700;
  color: rgb(0, 0, 0);

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
