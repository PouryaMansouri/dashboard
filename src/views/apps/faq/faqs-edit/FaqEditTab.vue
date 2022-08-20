<template>
  <div>
    <b-form>
      <b-row>
        <b-col cols="12" md="4">
          <b-form-group label="Question" label-for="question">
            <b-form-input id="question" v-model="faqData.question" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <b-form-group label="Answer" label-for="answer">
            <b-form-input id="answer" v-model="faqData.answer" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <b-form-group label="Is Active" label-for="is_active">
            <v-select
              v-model="faqData.is_active"
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
    faqData: {
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
        .dispatch("app-faq/editFaq", {
          id: router.currentRoute.params.id,
          faqData: props.faqData,
        })
        .then(() => {
          router.push({ name: "apps-faqs-list" });
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
