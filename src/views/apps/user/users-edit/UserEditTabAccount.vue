<template>
  <div>
    <b-form>
      <b-row>
        <b-col cols="12" md="4">
          <b-form-group label="Email" label-for="email">
            <b-form-input id="email" v-model="userData.email" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="FirstName" label-for="first_name">
            <b-form-input id="first_name" v-model="userData.first_name" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="LastName" label-for="last_name">
            <b-form-input id="last_name" v-model="userData.last_name" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Password" label-for="password">
            <b-form-input id="password" v-model="userData.password" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Is Active" label-for="is_active">
            <v-select
              v-model="userData.is_active"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="[
                { label: 'Active', value: true },
                { label: 'InActive', value: false },
              ]"
              :reduce="(val) => val.value"
              :clearable="false"
              input-id="is_active"
            />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Is Staff" label-for="is_staff">
            <v-select
              v-model="userData.is_staff"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="[
                { label: 'Staff', value: true },
                { label: 'NotStaff', value: false },
              ]"
              :reduce="(val) => val.value"
              :clearable="false"
              input-id="is_staff"
            />
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
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  setup(props) {
    const userDataOld = ref({});
    // ? Demo Purpose => Update image on click of update
    const refInputEl = ref(null);
    const previewEl = ref(null);

    const onSubmit = () => {
      // const filterdata = Object.keys(userDataOld).filter(
      //   (key) => userDataOld[key] !== props.userData[key]
      // );
      store
        .dispatch("app-user/editUser", {
          id: router.currentRoute.params.id,
          userData: props.userData,
        })
        .then(() => {
          router.push({ name: "apps-users-list" });
        });
    };

    return {
      avatarText,
      refInputEl,
      previewEl,
      onSubmit,
      userDataOld,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
