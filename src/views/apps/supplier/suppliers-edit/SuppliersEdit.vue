<template>
  <div v-if="supplierData">
    <b-alert variant="danger" :show="supplierData === undefined">
      <h4 class="alert-heading">Error fetching supplier data</h4>
      <div class="alert-body">
        No supplier found with this supplier id. Check for other suppliers.
      </div>
    </b-alert>
    <b-card>
      <b-card-header>
        <h3>Supplier Name: {{ supplierData.name }}</h3>
      </b-card-header>
      <b-row class="match-height">
        <b-col lg="4" md="6">
          <supplier-numbers :data="cols.col1" />
        </b-col>

        <b-col lg="4" md="6">
          <supplier-numbers :data="cols.col2" />
        </b-col>
      </b-row>
    </b-card>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Edit">
        <supplier-edit-tab :supplier-data="supplierData" class="mt-2 pt-75" />
      </app-collapse-item>
    </app-collapse>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Transfered">
        <supplier-transferred :supplierId="supplierData.id" />
      </app-collapse-item>
    </app-collapse>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Canceled">
        <supplier-canceled :supplierId="supplierData.id" />
      </app-collapse-item>
    </app-collapse>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Pending">
        <supplier-pending :supplierId="supplierData.id" />
      </app-collapse-item>
    </app-collapse>
    <!-- 

    <app-collapse accordion type="margin">
      <app-collapse-item title="Log">
        <supplier-logs :supplierId="supplierData.id" />
      </app-collapse-item>
    </app-collapse> -->
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
import supplierStoreModule from "../supplierStoreModule";
import SupplierEditTab from "./SupplierEditTab.vue";
import SupplierNumbers from "./SupplierNumbers.vue";
import SupplierTransferred from "@views/apps/supplier/suppliers-edit/supplier-transferred/SupplierTransferred.vue";
import SupplierCanceled from "@views/apps/supplier/suppliers-edit/supplier-canceled/SupplierCanceled.vue";
import SupplierPending from "@views/apps/supplier/suppliers-edit/supplier-pending/SupplierPending.vue";
// import SupplierLogs from "@views/apps/log/supplier-logs/SupplierLogs.vue";

export default {
  components: {
    BRow,
    BCol,
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    SupplierEditTab,
    AppCollapse,
    AppCollapseItem,
    BAvatar,
    BCardHeader,
    BImg,
    SupplierNumbers,
    BCardTitle,
    BCardBody,
    BMediaBody,
    BMedia,
    BMediaAside,
    BDropdown,
    BDropdownItem,
    SupplierTransferred,
    SupplierCanceled,
    SupplierPending,
    // SupplierLogs,
  },
  setup() {
    const supplierData = ref(null);

    const cols = ref({
      col1: [],
      col2: [],
      col3: [],
    });

    const Supplier_APP_STORE_MODULE_NAME = "app-supplier";

    // Register module
    if (!store.hasModule(Supplier_APP_STORE_MODULE_NAME))
      store.registerModule(Supplier_APP_STORE_MODULE_NAME, supplierStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(Supplier_APP_STORE_MODULE_NAME))
        store.unregisterModule(Supplier_APP_STORE_MODULE_NAME);
    });

    const makeDetailCols = () => {
      const totals = supplierData.value;
      cols.value.col1 = [
        {
          mode: "All Transferred",
          types: "Starbucks",
          avatar: "TrendingUpIcon",
          avatarVariant: "light-info",
          payment: `${totals.all_transferred}`,
          deduction: false,
        },
        {
          mode: "Today Transferred",
          types: "Starbucks",
          avatar: "TrendingUpIcon",
          avatarVariant: "light-info",
          payment: `${totals.today_transferred}`,
          deduction: false,
        },
        {
          mode: "Month Transferred",
          types: "Starbucks",
          avatar: "TrendingUpIcon",
          avatarVariant: "light-info",
          payment: `${totals.month_transferred}`,
          deduction: false,
        },
      ];
      cols.value.col2 = [
        {
          mode: "Total Purchase",
          types: "Starbucks",
          avatar: "DollarSignIcon",
          avatarVariant: "light-success",
          payment: `$${totals.total_purchase}`,
          deduction: false,
        },
        {
          mode: "Total Purchase Today",
          types: "Starbucks",
          avatar: "DollarSignIcon",
          avatarVariant: "light-success",
          payment: `$${totals.total_purchase_today}`,
          deduction: false,
        },
        {
          mode: "Total Purchase Month",
          types: "Starbucks",
          avatar: "DollarSignIcon",
          avatarVariant: "light-success",
          payment: `$${totals.total_purchase_month}`,
          deduction: false,
        },
      ];
    };

    store
      .dispatch("app-supplier/fetchSupplier", {
        id: router.currentRoute.params.id,
      })
      .then((response) => {
        supplierData.value = response.data;
        makeDetailCols();
      })
      .catch((error) => {
        if (error.response.status === 404) {
          supplierData.value = undefined;
        }
      });

    return {
      supplierData,
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
