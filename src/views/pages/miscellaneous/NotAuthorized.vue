<template>
  <div class="misc-wrapper shabnam-fd">
    <b-link class="brand-logo">
      <sarar-logo />
      <h2 class="brand-text text-primary ml-1">
        sarar - dashboard
      </h2>
    </b-link>

    <div class="misc-inner p-2 p-sm-3">
      <div class="w-100 text-center">
        <h2 class="mb-1">
          دسترسی شناسایی نشد! 🔐
        </h2>
        <p class="mb-2">
          شما دسترسی لازم به این صفحه را ندارید!! به خانه برگردید
        </p>
        <b-button
          variant="primary"
          class="mb-1 btn-sm-block"
          :to="loginRoute()"
        >برگشت به خانه</b-button>
        <b-img
          fluid
          :src="imgUrl"
          alt="Not authorized page"
        />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { BLink, BImg, BButton } from 'bootstrap-vue'
import SararLogo from '@core/layouts/components/Logo.vue'
import store from '@/store/index'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'

export default {
  components: {
    BLink, BImg, BButton, SararLogo,
  },
  data() {
    return {
      downImg: require('@/assets/images/pages/not-authorized.svg'),
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.downImg = require('@/assets/images/pages/not-authorized-dark.svg')
        return this.downImg
      }
      return this.downImg
    },
  },
  methods: {
    loginRoute() {
      const user = JSON.parse(localStorage.getItem('userData'))
      return getHomeRouteForLoggedInUser(user ? user.role : null)
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
