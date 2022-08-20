<template>
  <b-card>
    <b-media no-body>
      <b-media-aside>
        <b-img
          ref="previewEl"
          v-if="!imageUploaded"
          rounded
          :src="blankImage"
          height="175"
        />
        <b-img
          ref="previewEl"
          v-if="imageUploaded"
          :src="newImage"
          rounded
          height="175"
        />
      </b-media-aside>
      <b-media-body class="mt-75 ml-75">
        <!-- upload button -->
        <div v-if="spinner" class="text-center">
          <b-spinner variant="primary" label="Text Centered" />
        </div>
        <b-button
          id="pick-avatar"
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          size="sm"
          class="mb-75 mr-75"
        >
          Upload
        </b-button>
        <!--/ upload button -->

        <!-- reset -->
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          variant="outline-secondary"
          size="sm"
          class="mb-75 mr-75"
          @click="deleteImage"
        >
          Remove
        </b-button>
        <!--/ reset -->
      </b-media-body>
    </b-media>

    <avatar-cropper
      @uploading="handleUploading"
      @uploaded="handleUploaded"
      @completed="handleCompleted"
      @error="handlerError"
      :labels="{ submit: 'upload', cancel: 'cancel' }"
      :output-options="{ width: 1200, height: 1200 }"
      trigger="#pick-avatar"
      upload-url="/crop"
    />
  </b-card>
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
  },
  directives: {
    Ripple,
  },
  props: ["productId"],
  data() {
    return {
      profileFile: null,
      spinner: false,
      imageUploaded: false,
      newImage: false,
      blankImage: require("@/assets/images/blank.jpg"),
    };
  },
  methods: {
    deleteImage() {
      this.$swal({
        title: "Accept Or Deny",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Remove",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$http
            .delete(
              `/products-dashboard/products/${this.productId}/images/delete/`
            )
            .then((response) => {
              if (response.data.status == false) {
                this.$toast({
                  component: ToastificationContent,
                  position: "top-right",
                  props: {
                    title: "Error",
                    variant: "danger",
                    text: "Error",
                  },
                });
              } else {
                this.$swal({
                  icon: "success",
                  text: "Deleted",
                  confirmButtonText: "OK",
                  customClass: {
                    confirmButton: "btn btn-primary",
                  },
                });
                this.imageUploaded = false;
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    },
    handleUploading(form, xhr) {
      this.spinner = true;
      let formData = new FormData();
      formData.append("image", form.get("file"));
      this.$http
        .patch(
          `/products-dashboard/products/${this.productId}/images/`,
          formData
        )
        .then((response) => {
          this.spinner = false;
          this.imageUploaded = true;
          this.newImage = response.data.image;
        })
        .catch((e) => {
          console.log(e);
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
