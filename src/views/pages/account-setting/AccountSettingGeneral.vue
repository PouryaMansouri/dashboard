<template>
  <b-card>
    <!-- media -->
    <b-media no-body>
      <b-media-aside>
        <b-img ref="previewEl" rounded :src="photo" height="80" />
        <b-img
          ref="previewEl"
          v-if="!photo"
          rounded
          :src="generalData.avatar"
          height="80"
        />

        <!--/ avatar -->
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
          @click="deleteUserPhoto"
        >
          Remove
        </b-button>
        <!--/ reset -->
      </b-media-body>
    </b-media>
    <!--/ media -->

    <!-- form -->
    <b-form class="mt-2">
      <b-row>
        <b-col sm="6">
          <b-form-group label="First Name" label-for="first_name">
            <b-form-input
              v-model="generalData.user.first_name"
              name="first_name"
              placeholder="First Name"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Last Name" label-for="last_name">
            <b-form-input
              v-model="generalData.user.last_name"
              name="last_name"
              placeholder="Last Name"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="E-mail" label-for="account-e-mail">
            <b-form-input
              v-model="generalData.user.email"
              name="email"
              placeholder="Email"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Phone Number" label-for="phone_number">
            <b-form-input
              v-model="generalData.user.phone_number"
              name="phone_number"
              placeholder="Phone Number"
            />
          </b-form-group>
        </b-col>

        <b-col cols="12">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mt-2 mr-1"
          >
            Save changes
          </b-button>
        </b-col>
      </b-row>
    </b-form>
    <avatar-cropper
      @uploading="handleUploading"
      @uploaded="handleUploaded"
      @completed="handleCompleted"
      @error="handlerError"
      :labels="{ submit: 'upload', cancel: 'cancel' }"
      :output-options="{ width: 640, height: 640 }"
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
  },
  directives: {
    Ripple,
  },
  props: {
    generalData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      profileFile: null,
      spinner: false,
    };
  },
  methods: {
    deleteUserPhoto() {
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
            .delete(`/accounts/image/delete/`)
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
                window.location.reload(true);
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
      formData.append("avatar", form.get("file"));
      this.$http
        .patch("/accounts/image/update/", formData)
        .then(() => {
          this.spinner = false;
          window.location.reload(true);
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
