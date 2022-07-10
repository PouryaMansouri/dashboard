<template>
  <div class="auth-wrapper auth-v1 px-2 shabnam-fd">
    <div class="auth-inner py-2">
      <!-- Login v1 -->
      <b-card class="mb-0">
        <b-link class="brand-logo">
          <sarar-logo />

          <h2 class="brand-text text-primary ml-1">sarar - dashboard</h2>
        </b-link>

        <!-- form -->
        <validation-observer ref="loginForm" #default="{ invalid }">
          <b-form
            autocomplete="off"
            class="auth-login-form mt-2"
            @submit.prevent
          >
            <!-- email -->
            <b-form-group label-for="email" label="Email یا نام کاربری">
              <validation-provider #default="{ errors }" name="Email">
                <b-form-input
                  id="email"
                  v-model="userEmail"
                  name="login-email"
                  :state="errors.length > 0 ? false : null"
                  placeholder="email@gmail.com | username "
                  autofocus
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- password -->
            <b-form-group>
              <div class="d-flex justify-content-between">
                <label for="password">رمز عبور</label>
                <b-link :to="{ name: 'auth-forgot-password-v1' }">
                  <small>رمزعبور خود را فراموش کردید?</small>
                </b-link>
              </div>
              <validation-provider #default="{ errors }" name="Password">
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="password"
                    v-model="password"
                    :type="passwordFieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false : null"
                    name="login-password"
                    placeholder="رمزعبور"
                  />

                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIcon"
                      @click="togglePasswordVisibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
                <b-link :to="{ name: 'otp-send' }">
                  <small>ورود با شماره موبایل</small>
                </b-link>
              </validation-provider>
            </b-form-group>

            <!-- checkbox -->

            <!-- submit button -->
            <b-button
              variant="primary"
              type="submit"
              block
              :disabled="invalid"
              @click="login"
            >
              ورود
            </b-button>
          </b-form>
        </validation-observer>
      </b-card>
      <!-- /Login v1 -->
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import {
  BButton,
  BForm,
  BFormInput,
  BFormGroup,
  BCard,
  BLink,
  BInputGroup,
  BInputGroupAppend,
} from "bootstrap-vue";
import SararLogo from "@core/layouts/components/Logo.vue";
import { required, email } from "@validations";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import useJwt from "@/auth/jwt/useJwt";
import { getHomeRouteForLoggedInUser } from "@/auth/utils";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    // BSV
    BButton,
    BForm,
    BFormInput,
    BFormGroup,
    BCard,
    BLink,
    SararLogo,
    BInputGroup,
    BInputGroupAppend,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      userEmail: "",
      password: "",
      status: "",
      // validation rules
      required,
      email,
    };
  },
  methods: {
    login() {
      this.$http
        .post("auth/email/login", {
          email: this.userEmail,
          password: this.password,
        })
        .then((response) => {
          const { accessToken, user, userType } = response.data;
          const userData = user;
          userData.role = "admin";
          if (userData.userType == "Coach") {
            userData.type = "مربی";
          }
          if (userData.userType == "Player") {
            userData.type = "بازیکن";
          }
          if (userData.userType == "Club") {
            userData.type = "باشگاه";
          }
          userData.fullName = `${userData.firstName} ${userData.lastName}`;
          userData.avatar = `${process.env.VUE_APP_API_BASE_URL}/photos/user/${userData.photo.name}`;
          userData.ability = [
            {
              action: "manage",
              subject: "all",
            },
          ];
          useJwt.setToken(accessToken);
          localStorage.setItem("userData", JSON.stringify(userData));
          this.$ability.update(userData.ability);

          // ? This is just for demo purpose as well.
          // ? Because we are showing eCommerce app's cart items count in navbar
          // this.$store.commit('app-ecommerce/UPDATE_CART_ITEMS_COUNT', userData.extras.eCommerceCartItemsCount)

          // ? This is just for demo purpose. Don't think CASL is role based in this case, we used role in if condition just for ease
          this.$router
            .replace(getHomeRouteForLoggedInUser(userType))
            .then(() => {
              this.$toast({
                component: ToastificationContent,
                position: "top-right",
                props: {
                  // title: `خوش آمدی ${firstName} ${lastName}`,
                  title: "خوش آمدی",
                  icon: "CoffeeIcon",
                  variant: "success",
                  text: "شما به درستی وارد sarar - dashboard شدید",
                },
              });
            });
        })
        .catch((error) => {
          this.$toast({
            component: ToastificationContent,
            position: "top-right",
            props: {
              // title: `خوش آمدی ${firstName} ${lastName}`,
              title: "خطا",
              variant: "danger",
              text: "اطلاعات ورودی اشتباه است",
            },
          });

          console.log(error);
        });
    },
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>
