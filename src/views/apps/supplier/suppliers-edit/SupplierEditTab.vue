<template>
  <div>
    <b-form>
      <b-row>
        <b-col cols="12" md="4">
          <b-form-group label="Name" label-for="name">
            <b-form-input id="name" v-model="supplierData.name" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <b-form-group label="Address" label-for="address">
            <b-form-input id="address" v-model="supplierData.address" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <b-form-group label="Phone" label-for="phone">
            <b-form-input id="phone" v-model="supplierData.phone" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <b-form-group label="Email" label-for="email">
            <b-form-input id="email" v-model="supplierData.email" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <b-form-group label="Website" label-for="website">
            <b-form-input id="website" v-model="supplierData.website" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <b-form-group label="Description" label-for="description">
            <b-form-textarea id="description" v-model="supplierData.description" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <b-form-group label="Supplier Type" label-for="supplier_type">
            <v-select
              v-model="supplierData.supplier_type"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="[
                {
                  label: 'Company',
                  value: 1,
                },
                { label: 'Person', value: 2 },
              ]"
              :reduce="(val) => val.value"
              :clearable="false"
              input-id="supplier_type"
            />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <b-form-group label="Work Type" label-for="work_type">
            <v-select
              v-model="supplierData.work_type"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="[
                { label: 'Provider', value: 1 },
                { label: 'Buyer', value: 2 },
                { label: 'Distributor', value: 3 },
                { label: 'Other', value: 4 },
              ]"
              :reduce="(val) => val.value"
              :clearable="false"
              input-id="work_type"
            />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <b-form-group label="Is Active" label-for="is_active">
            <v-select
              v-model="supplierData.is_active"
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
  BFormTextarea
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
    BFormTextarea
  },
  props: {
    supplierData: {
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
        .dispatch("app-supplier/editSupplier", {
          id: router.currentRoute.params.id,
          supplierData: props.supplierData,
        })
        .then(() => {
          router.push({ name: "apps-suppliers-list" });
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