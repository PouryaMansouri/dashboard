<template>
  <div>
    <div>
      <b-form
        ref="form"
        :style="{ height: trHeight }"
        class="repeater-form"
        @submit.prevent="repeateAgain"
      >
        <!-- Row Loop -->
        <b-row
          v-for="(item, index) in items"
          :id="item.id"
          :key="item.id"
          ref="row"
        >
          <image-gallery
            :productId="productId"
            :itemId="item.id"
          />
          <!-- Remove Button -->
          <b-col lg="2" md="3" class="mb-50">
            <b-button
              v-ripple.400="'rgba(234, 84, 85, 0.15)'"
              variant="outline-danger"
              class="mt-0 mt-md-2"
              @click="removeItem(index)"
            >
              <feather-icon icon="XIcon" class="mr-25" />
              <span>Delete</span>
            </b-button>
          </b-col>
          <b-col cols="12">
            <hr />
          </b-col>
        </b-row>
      </b-form>
    </div>
    <b-button
      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
      variant="primary"
      @click="repeateAgain"
    >
      <feather-icon icon="PlusIcon" class="mr-25" />
      <span>Add New Image</span>
    </b-button>
  </div>
</template>

<script>
import {
  BFormFile,
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BRow,
  BCol,
  BAlert,
  BCard,
  BCardText,
  BMedia,
  BMediaAside,
  BMediaBody,
  BLink,
  BImg,
  BSpinner,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { useInputImageRenderer } from "@core/comp-functions/forms/form-utils";
import { ref } from "@vue/composition-api";
import AvatarCropper from "vue-avatar-cropper";
import ImageGallery from "./ImageGallery.vue";

export default {
  components: {
    BButton,
    BForm,
    BImg,
    BFormFile,
    BFormGroup,
    BFormInput,
    BRow,
    BCol,
    BAlert,
    BCard,
    BCardText,
    BMedia,
    BMediaAside,
    BMediaBody,
    BLink,
    AvatarCropper,
    BSpinner,
    ImageGallery,
  },
  directives: {
    Ripple,
  },
  props: ["productId"],
  data() {
    return {
      items: [],
      nextTodoId: 2,
    };
  },
  mounted() {
    this.initTrHeight();
  },
  created() {
    window.addEventListener("resize", this.initTrHeight);
  },
  destroyed() {
    window.removeEventListener("resize", this.initTrHeight);
  },
  methods: {
    repeateAgain() {
      this.items.push({
        id: (this.nextTodoId += this.nextTodoId),
      });

      this.$nextTick(() => {
        this.trAddHeight(this.$refs.row[0].offsetHeight);
      });
    },
    removeItem(index) {
      this.items.splice(index, 1);
      this.trTrimHeight(this.$refs.row[0].offsetHeight);
    },
    initTrHeight() {
      this.trSetHeight(null);
      this.$nextTick(() => {
        this.trSetHeight(this.$refs.form.scrollHeight);
      });
    },
  },
  setup() {
    const refInputEl = ref(null);
    const previewEl = ref(null);

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, previewEl);

    return {
      refInputEl,
      previewEl,
      inputImageRenderer,
    };
  },
};
</script>

<style lang="scss" scoped>
.repeater-form {
  overflow: hidden;
  transition: 0.35s height;
}
</style>