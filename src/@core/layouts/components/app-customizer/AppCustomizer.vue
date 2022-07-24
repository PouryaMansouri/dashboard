<template>
  <div
    class="customizer d-none d-md-block"
    :class="{'open': isCustomizerOpen}"
  >
    <!-- Toggler -->
    <b-link
      class="customizer-toggle d-flex align-items-center justify-content-center"
      @click="isCustomizerOpen = !isCustomizerOpen"
    >
      <feather-icon
        icon="SettingsIcon"
        size="15"
        class="spinner"
      />
    </b-link>
    <!-- /Toggler -->

    <!-- Header -->
    <div class="customizer-section d-flex justify-content-between align-items-center">
      <div>
        <h4 class="text-uppercase mb-0">
          Theme Customizer
        </h4>
        <small>Customize &amp; Preview in Real Time</small>
      </div>
      <feather-icon
        icon="XIcon"
        size="18"
        class="cursor-pointer"
        @click="isCustomizerOpen = !isCustomizerOpen"
      />
    </div>
    <!-- Header -->

    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="ps-customizer-area scroll-area"
    >
      <!-- Skin, RTL, Router Animation -->
      <div class="customizer-section">

        <!-- Skin -->
        <b-form-group label="Skin">
          <b-form-radio-group
            id="skin-radio-group"
            v-model="skin"
            name="skin"
            :options="skinOptions"
          />
        </b-form-group>

        <!-- RTL -->
        <b-form-group
          label="RTL"
          label-cols="10"
        >
          <b-form-checkbox
            v-model="isRTL"
            class="mr-0 mt-50"
            name="is-rtl"
            switch
            inline
          />
        </b-form-group>

      </div>
      <!-- /Skin, RTL, Router Animation -->

      <!-- SECTION: Menu -->
      <div class="customizer-section">

        <!-- Layout Type -->
        <b-form-group
          label="Menu Layout"
        >
          <b-form-radio-group
            v-model="layoutType"
            name="layout-type"
            :options="layoutTypeOptions"
          />
        </b-form-group>

        <!-- Menu Visiblity -->
        <div class="d-flex justify-content-between align-items-center mt-2">
          <span class="font-weight-bold">Menu Hidden</span>
          <b-form-checkbox
            v-model="isNavMenuHidden"
            name="is-menu-visible"
            class="mr-0"
            switch
            inline
          />
        </div>

      </div>

      <!-- SECTION: Navbar -->
      <div class="customizer-section">        

        <!-- Navbar Type -->
        <b-form-group :label="layoutType === 'vertical' ? 'Navbar Type' : 'Menu Type'">
          <b-form-radio-group
            v-model="navbarType"
            name="navbar-type"
            :options="navbarTypes"
          />
        </b-form-group>
      </div>
      
    </vue-perfect-scrollbar>
  </div>
</template>

<script>
import {
  BLink, BFormRadioGroup, BFormGroup, BFormCheckbox,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import useAppCustomizer from './useAppCustomizer'

export default {
  components: {
    // BSV
    BLink,
    BFormRadioGroup,
    BFormCheckbox,
    BFormGroup,

    // 3rd party
    vSelect,
    VuePerfectScrollbar,

  },
  setup() {
    const {
      // Vertical Menu
      isVerticalMenuCollapsed,

      // Customizer
      isCustomizerOpen,

      // Skin
      skin,
      skinOptions,

      // Content Width
      contentWidth,
      contentWidthOptions,

      // RTL
      isRTL,

      // routerTransition
      routerTransition,
      routerTransitionOptions,

      // Layout Type
      layoutType,
      layoutTypeOptions,

      // NavMenu Hidden
      isNavMenuHidden,

      // Navbar
      navbarColors,
      navbarTypes,
      navbarBackgroundColor,
      navbarType,

      // Footer
      footerTypes,
      footerType,
    } = useAppCustomizer()

    if (layoutType.value === 'horizontal') {
      // Remove semi-dark skin option in horizontal layout
      const skinSemiDarkIndex = skinOptions.findIndex(s => s.value === 'semi-dark')
      delete skinOptions[skinSemiDarkIndex]

      // Remove menu hidden radio in horizontal layout => As we already have switch for it
      const menuHiddneIndex = navbarTypes.findIndex(t => t.value === 'hidden')
      delete navbarTypes[menuHiddneIndex]
    }

    // Perfect Scrollbar
    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    }

    return {
      // Vertical Menu
      isVerticalMenuCollapsed,

      // Customizer
      isCustomizerOpen,

      // Skin
      skin,
      skinOptions,

      // Content Width
      contentWidth,
      contentWidthOptions,

      // RTL
      isRTL,

      // routerTransition
      routerTransition,
      routerTransitionOptions,

      // Layout Type
      layoutType,
      layoutTypeOptions,

      // NavMenu Hidden
      isNavMenuHidden,

      // Navbar
      navbarColors,
      navbarTypes,
      navbarBackgroundColor,
      navbarType,

      // Footer
      footerTypes,
      footerType,

      // Perfect Scrollbar
      perfectScrollbarSettings,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>

<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
@import '~@core/scss/base/components/variables-dark';

.customizer-section {
  padding: 1.5rem;
    border-bottom: 1px solid #ebe9f1;

  .dark-layout & {
    border-color: $theme-dark-border-color;
  }

  #skin-radio-group ::v-deep {
    .custom-control-inline {
      margin-right: 0.7rem;
    }
  }

  .form-group {
    margin-bottom: 1.5rem;;
    &:last-of-type {
    margin-bottom: 0;
    }
    ::v-deep legend {
      font-weight: 500;
    }
  }
}

.mark-active {
  box-shadow: 0 0 0 0.2rem rgba(38,143,255,.5);
}

.ps-customizer-area {
  height: calc(100% - 83px)
}
</style>
