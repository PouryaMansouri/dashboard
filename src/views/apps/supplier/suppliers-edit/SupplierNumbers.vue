<template>
  <b-card v-if="data" class="card-transaction" no-body>
    <b-card-body>
      <div
        v-for="supplierData in data"
        :key="supplierData.mode"
        class="transaction-item"
      >
        <b-media no-body>
          <b-media-aside>
            <b-avatar rounded size="42" :variant="supplierData.avatarVariant">
              <feather-icon size="18" :icon="supplierData.avatar" />
            </b-avatar>
          </b-media-aside>
          <b-media-body>
            <h6 class="supplierData-title">
              {{ supplierData.mode }}
            </h6>
          </b-media-body>
        </b-media>
        <div
          class="font-weight-bolder"
          :class="supplierData.deduction ? 'text-danger' : 'text-success'"
        >
          {{ supplierData.payment }}
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard,
  BCardHeader,
  BCardTitle,
  BCardBody,
  BMediaBody,
  BMedia,
  BMediaAside,
  BAvatar,
  BDropdown,
  BDropdownItem,
} from "bootstrap-vue";

export default {
  components: {
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BMediaBody,
    BMedia,
    BMediaAside,
    BAvatar,
    BDropdown,
    BDropdownItem,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
