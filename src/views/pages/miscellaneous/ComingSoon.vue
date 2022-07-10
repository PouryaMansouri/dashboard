<template>
  <!-- Coming soon page-->
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
          این صفحه به زودی آماده میشود 🚀
        </h2>
        <b-img
          fluid
          :src="imgUrl"
          alt="Coming soon page"
        />
      </div>
    </div>
  </div>
<!-- / Coming soon page-->
</template>

<script>
/* eslint-disable global-require */
import {
  BLink, BImg,
} from 'bootstrap-vue'
import SararLogo from '@core/layouts/components/Logo.vue'
import store from '@/store/index'

export default {
  components: {
    SararLogo,
    BLink,
    BImg,
  },
  data() {
    return {
      downImg: require('@/assets/images/pages/coming-soon.svg'),
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.downImg = require('@/assets/images/pages/coming-soon-dark.svg')
        return this.downImg
      }
      return this.downImg
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
