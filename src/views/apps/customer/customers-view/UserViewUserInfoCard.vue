<template>
  <div>
    <b-card>
      <b-row>
        <!-- User Info: Left col -->
        <b-col
          cols="12"
          md="6"
          xl="6"
          class="d-flex justify-content-between flex-column"
        >
          <!-- User Avatar & Action Buttons -->
          <div class="d-flex justify-content-start">
            <b-avatar :src="userData.avatar" size="104px" rounded />
            <div class="d-flex flex-column ml-1">
              <div class="mb-1">
                <h4 class="mb-0">
                  {{ userData.first_name + " " + userData.last_name }}
                </h4>
                <span class="card-text">{{ userData.email }}</span>
              </div>
              <div class="d-flex flex-wrap">
                <b-button
                  :to="{ name: 'apps-users-edit', params: { id: userData.id } }"
                  variant="primary"
                >
                  Edit
                </b-button>
              </div>
            </div>
          </div>
        </b-col>
        <!-- Right Col: Table -->
        <b-col cols="12" md="6" xl="6">
          <table class="mt-2 mt-xl-0 w-100">
            <tr>
              <th class="pb-50">
                <feather-icon icon="MailIcon" class="mr-75" />
                <span class="font-weight-bold">Email</span>
              </th>
              <td class="pb-50">
                {{ userData.email }}
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <feather-icon icon="UserIcon" class="mr-75" />
                <span class="font-weight-bold">First Name</span>
              </th>
              <td class="pb-50 text-capitalize">
                {{ userData.first_name }}
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <feather-icon icon="UserIcon" class="mr-75" />
                <span class="font-weight-bold">Last Name</span>
              </th>
              <td class="pb-50 text-capitalize">
                {{ userData.last_name }}
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <feather-icon icon="CheckIcon" class="mr-75" />
                <span class="font-weight-bold">Is Active</span>
              </th>
              <td class="pb-50">
                {{ userData.is_active ? "Yes" : "No" }}
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <feather-icon icon="CheckIcon" class="mr-75" />
                <span class="font-weight-bold">Is Staff</span>
              </th>
              <td class="pb-50">
                {{ userData.is_staff ? "Yes" : "No" }}
              </td>
            </tr>
            <tr>
              <th class="pb-50">
                <feather-icon icon="CheckIcon" class="mr-75" />
                <span class="font-weight-bold">Role</span>
              </th>
              <td class="pb-50">
                {{ userRole(userData.role) }}
              </td>
            </tr>
            <tr>
              <th>
                <feather-icon icon="ClockIcon" class="mr-75" />
                <span class="font-weight-bold">Date Joined</span>
              </th>
              <td>
                {{ new Date(userData.date_joined) }}
              </td>
            </tr>
            <tr>
              <th>
                <feather-icon icon="ClockIcon" class="mr-75" />
                <span class="font-weight-bold">Last Login</span>
              </th>
              <td>
                {{ getTime(userData.last_login) }}
              </td>
            </tr>
          </table>
        </b-col>
      </b-row>
    </b-card>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Customer Orders">
        <b-row>
          <b-col cols="12">
            <customer-orders :customerId="userData.id" />
          </b-col>
        </b-row>
      </app-collapse-item>
    </app-collapse>   
    
     <app-collapse accordion type="margin">
      <app-collapse-item title="Customer Carts">
        <b-row>
          <b-col cols="12">
            <customer-carts :customerId="userData.id" />
          </b-col>
        </b-row>
      </app-collapse-item>
    </app-collapse>

    <app-collapse accordion type="margin">
      <app-collapse-item title="Customer Actions">
        <b-row>
          <b-col cols="12">
            <user-action-logs :userId="userData.id" />
          </b-col>
        </b-row>
      </app-collapse-item>
    </app-collapse>
  </div>
</template>

<script>
import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";
import {
  BCard,
  BButton,
  BAvatar,
  BRow,
  BCol,
  BCardHeader,
} from "bootstrap-vue";
import { avatarText } from "@core/utils/filter";
import UserActionLogs from "@views/apps/log/user-action-logs/UserActionLogs";
import UserChangeLogs from "@views/apps/log/user-change-logs/UserChangeLogs";
import CustomerOrders from "../customer-orders/CustomerOrders.vue";
import CustomerCarts from "../customer-carts/CustomerCarts.vue";

export default {
  components: {
    BCard,
    BButton,
    BRow,
    BCol,
    BAvatar,
    UserActionLogs,
    UserChangeLogs,
    BCardHeader,
    AppCollapse,
    AppCollapseItem,
    CustomerOrders,
    CustomerCarts
  },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getTime(time) {
      if (time == null) return "Not Yet Legged In";

      return new Date(time);
    },
    userRole(role) {
      if (role == 0) return "Normal";
      if (role == 1) return "Admin";
      if (role == 2) return "Cashier";
      if (role == 3) return "Stock Keeper";
    },
  },
  setup() {
    return {
      avatarText,
    };
  },
};
</script>

<style>
</style>
