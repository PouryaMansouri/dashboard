<template>
  <div>
    <b-form>
      <b-row>
        <b-col cols="12" md="4">
          <b-form-group label="Name" label-for="name">
            <b-form-input id="name" v-model="colorData.name" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Code" label-for="code">
            <b-form-input id="code" v-model="colorData.code" />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="4">
          <b-form-group label="Pick Color" label-for="pick">
            <picker :value="colorData.code" @input="updateValue" />
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
import { Chrome } from "vue-color";

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
    picker: Chrome,
  },
  props: {
    colorData: {
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
        .dispatch("app-color/editColor", {
          id: router.currentRoute.params.id,
          colorData: props.colorData,
        })
        .then(() => {
          router.push({ name: "apps-colors-list" });
        });
    };

    const updateValue = (color) => {
      props.colorData.code = color.hex;
    };

    return {
      avatarText,
      refInputEl,
      previewEl,
      onSubmit,
      updateValue,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
