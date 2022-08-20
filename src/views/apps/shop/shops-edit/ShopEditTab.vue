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
          <b-form-group label="Slug" label-for="slug">
            <b-form-input id="slug" v-model="shopData.slug" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Description" label-for="description">
            <b-form-input id="description" v-model="shopData.description" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Owner" label-for="owner">
            <b-form-select
              :value="shopData.owner.id"
              @input="inputOwner"
              :options="usersOption"
              :select-size="4"
            />
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
  BFormSelect,
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
    BFormSelect,
  },
  props: {
    shopData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      usersOption: [],
    };
  },
  methods: {
    getUsers() {
      console.log(this.$props.shopData);
      store.dispatch("app-user/fetchUsersOption").then((response) => {
        this.usersOption = response;
      });
    },
    inputOwner(value) {
      this.$props.shopData.owner = value;
    },
  },
  created() {
    this.getUsers();
  },
  setup(props) {
    const refInputEl = ref(null);
    const previewEl = ref(null);

    const onSubmit = () => {
      props.shopData.owner = store
        .dispatch("app-shop/editShop", {
          id: router.currentRoute.params.id,
          shopData: props.shopData,
        })
        .then(() => {
          router.push({ name: "apps-shops-list" });
        });
    };

    return {
      avatarText,
      refInputEl,
      previewEl,
      onSubmit,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
