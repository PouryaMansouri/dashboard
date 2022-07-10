<template>
  <b-nav-item-dropdown
    id="dropdown-grouped"
    variant="link"
    class="dropdown-language shabnam-fd"
    left
  >
    <template #button-content>
      <span class="ml-50 text-body">پنل {{ typeName }}</span>
    </template>
    <b-dropdown-item v-if="typeName != 'باشگاه'">
      <div class="mb-30">{{ parentType }}:</div>
      <span class="ml-100">{{ parentName }}</span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import { BNavItemDropdown, BDropdownItem, BImg } from "bootstrap-vue";

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    BImg,
  },
  props: ["typeName", "parentType", "parentName"],
  methods: {},
};
</script>

<style>
</style>
