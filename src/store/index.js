import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import productStoreModule from '@/views/apps/product/productStoreModule'
import categoryStoreModule from '@/views/apps/category/categoryStoreModule'
import brandStoreModule from '@/views/apps/brand/brandStoreModule'
import shopStoreModule from '@/views/apps/shop/shopStoreModule'
import stockStoreModule from '@/views/apps/stock/stockStoreModule'
import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'
import colorStoreModule from '@/views/apps/color/colorStoreModule'
import sizeStoreModule from '@/views/apps/size/sizeStoreModule'
import featureStoreModule from '@/views/apps/feature/featureStoreModule'
import userStoreModule from '@/views/apps/user/userStoreModule'
import discountStoreModule from '@/views/apps/discount/discountStoreModule'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
    'app-product': productStoreModule,
    'app-category': categoryStoreModule,
    'app-color': colorStoreModule,
    'app-size': sizeStoreModule,
    'app-feature': featureStoreModule,
    'app-brand': brandStoreModule,
    'app-shop': shopStoreModule,
    'app-stock': stockStoreModule,
    'app-user': userStoreModule,
    'app-discount': discountStoreModule,
  },
  strict: process.env.DEV,
})
