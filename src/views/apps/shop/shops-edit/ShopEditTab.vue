<template>
  <div>
    <b-form>
      <b-row>
        <b-col cols="12" md="4">
          <b-form-group label="Name" label-for="name">
            <b-form-input id="name" v-model="shopData.name" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Description" label-for="description">
            <b-form-input id="description" v-model="shopData.description" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Address" label-for="address">
            <b-form-input id="address" v-model="shopData.address" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Phone" label-for="phone">
            <b-form-input id="phone" v-model="shopData.phone" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Email" label-for="email">
            <b-form-input id="email" v-model="shopData.email" />
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>

    <b-button
      variant="primary"
      class="mb-1 mb-sm-0 mr-0 mr-sm-1"
      :block="$store.getters['app/currentBreakPoint'] === 'xs'"
      @click="onSubmit"
    >
      Save Changes
    </b-button>
  </div>
</template>

<script>
import {
  BButton,
  BMedia,
  BAvatar,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BTable,
  BCard,
  BCardHeader,
  BCardTitle,
  BFormCheckbox,
} from "bootstrap-vue";
import { avatarText } from "@core/utils/filter";
import vSelect from "vue-select";
import { ref } from "@vue/composition-api";
import store from "@/store";
import router from "@/router";

export default {
  components: {
    BButton,
    BMedia,
    BAvatar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    BTable,
    BCard,
    BCardHeader,
    BCardTitle,
    BFormCheckbox,
    vSelect,
  },
  props: {
    shopData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  setup(props) {
    const refInputEl = ref(null);
    const previewEl = ref(null);

    const onSubmit = () => {
      store
        .dispatch("app-shop/editShop", {
          id: router.currentRoute.params.id,
          shopData: props.shopData,
        })
        .then(() => {});
    };

    return {
      avatarText,
      refInputEl,
      previewEl,
      onSubmit,
      shopDataOld,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
