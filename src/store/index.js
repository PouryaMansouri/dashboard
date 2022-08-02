import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import productStoreModule from '@/views/apps/product/productStoreModule'
import categoryStoreModule from '@/views/apps/category/categoryStoreModule'
import brandStoreModule from '@/views/apps/brand/brandStoreModule'
import shopStoreModule from '@/views/apps/shop/shopStoreModule'
import stockStoreModule from '@/views/apps/stock/stockStoreModule'
import ecommerceStoreModule from '@/views/apps/e-commerce/eCommerceStoreModule'
import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
    'app-product': productStoreModule,
    'app-category': categoryStoreModule,
    'app-brand': brandStoreModule,
    'app-shop': shopStoreModule,
    'app-stock': stockStoreModule,
    'app-ecommerce': ecommerceStoreModule,
  },
  strict: process.env.DEV,
})
