export default [
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/error/Error404.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/login',
    name: 'auth-login',
    component: () => import('@/views/pages/authentication/Login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/pages/miscellaneous/coming-soon',
    name: 'misc-coming-soon',
    component: () => import('@/views/pages/miscellaneous/ComingSoon.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/pages/miscellaneous/not-authorized',
    name: 'misc-not-authorized',
    component: () => import('@/views/pages/miscellaneous/NotAuthorized.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
  {
    path: '/pages/miscellaneous/under-maintenance',
    name: 'misc-under-maintenance',
    component: () => import('@/views/pages/miscellaneous/UnderMaintenance.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/pages/miscellaneous/error',
    name: 'misc-error',
    component: () => import('@/views/pages/miscellaneous/Error.vue'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/pages/account-setting',
    name: 'pages-account-setting',
    component: () => import('@/views/pages/account-setting/AccountSetting.vue'),
    meta: {
      pageTitle: 'Account Settings',
    },
  },
  {
    path: '/apps/users/list',
    name: 'apps-users-list',
    component: () => import('@/views/apps/user/users-list/UsersList.vue'),
  },
  {
    path: '/apps/users/view/:id',
    name: 'apps-users-view',
    component: () => import('@/views/apps/user/users-view/UsersView.vue'),
  },
  {
    path: '/apps/users/edit/:id',
    name: 'apps-users-edit',
    component: () => import('@/views/apps/user/users-edit/UsersEdit.vue'),
  },
  {
    path: '/apps/category/list',
    name: 'apps-categories-list',
    component: () => import('@/views/apps/category/categories-list/CategoriesList.vue'),
  },
  {
    path: '/apps/categories/edit/:id',
    name: 'apps-categories-edit',
    component: () => import('@/views/apps/category/categories-edit/CategoriesEdit.vue'),
  },
  {
    path: '/apps/color/list',
    name: 'apps-colors-list',
    component: () => import('@/views/apps/color/colors-list/ColorsList.vue'),
  },
  {
    path: '/apps/colors/edit/:id',
    name: 'apps-colors-edit',
    component: () => import('@/views/apps/color/colors-edit/ColorsEdit.vue'),
  },
  {
    path: '/apps/size/list',
    name: 'apps-sizes-list',
    component: () => import('@/views/apps/size/sizes-list/SizesList.vue'),
  },
  {
    path: '/apps/sizes/edit/:id',
    name: 'apps-sizes-edit',
    component: () => import('@/views/apps/size/sizes-edit/SizesEdit.vue'),
  },
  {
    path: '/apps/feature/list',
    name: 'apps-features-list',
    component: () => import('@/views/apps/feature/features-list/FeaturesList.vue'),
  },
  {
    path: '/apps/features/edit/:id',
    name: 'apps-features-edit',
    component: () => import('@/views/apps/feature/features-edit/FeaturesEdit.vue'),
  },
  {
    path: '/apps/coupon/list',
    name: 'apps-coupons-list',
    component: () => import('@/views/apps/discount/coupon/coupons-list/CouponsList.vue'),
  },
  {
    path: '/apps/campaign/list',
    name: 'apps-campaigns-list',
    component: () => import('@/views/apps/discount/campaign/campaigns-list/CampaignsList.vue'),
  },
  {
    path: '/apps/faq/list',
    name: 'apps-faqs-list',
    component: () => import('@/views/apps/faq/faqs-list/FaqsList.vue'),
  },
  {
    path: '/apps/faqs/edit/:id',
    name: 'apps-faqs-edit',
    component: () => import('@/views/apps/faq/faqs-edit/FaqsEdit.vue'),
  },
  {
    path: '/apps/brands/list',
    name: 'apps-brands-list',
    component: () => import('@/views/apps/brand/brands-list/BrandsList.vue'),
  },
  {
    path: '/apps/brands/edit/:id',
    name: 'apps-brands-edit',
    component: () => import('@/views/apps/brand/brands-edit/BrandsEdit.vue'),
  },
  {
    path: '/apps/shops/list',
    name: 'apps-shops-list',
    component: () => import('@/views/apps/shop/shops-list/ShopsList.vue'),
  },
  {
    path: '/apps/shops/edit/:id',
    name: 'apps-shops-edit',
    component: () => import('@/views/apps/shop/shops-edit/ShopsEdit.vue'),
  },
  {
    path: '/apps/invoice/list',
    name: 'apps-invoices-list',
    component: () => import('@/views/apps/invoice/invoice-list/InvoiceList.vue'),
  },
  {
    path: '/apps/invoice/preview/:id',
    name: 'apps-invoices-preview',
    component: () => import('@/views/apps/invoice/invoice-preview/InvoicePreview.vue'),
  },
  {
    path: '/apps/invoice/add/',
    name: 'apps-invoices-add',
    component: () => import('@/views/apps/invoice/invoice-add/InvoiceAdd.vue'),
  },
  {
    path: '/apps/invoice/edit/:id',
    name: 'apps-invoices-edit',
    component: () => import('@/views/apps/invoice/invoice-edit/InvoiceEdit.vue'),
  },
  {
    path: '/apps/product/list',
    name: 'apps-products-list',
    component: () => import('@/views/apps/product/products-list/ProductsList.vue'),
    meta: {
      contentRenderer: 'sidebar-left-detached',
      contentClass: 'ecommerce-application',
    },
  },
  {
    path: '/apps/product/:id',
    name: 'apps-product-details',
    component: () => import('@/views/apps/product/product-details/ProductDetails.vue'),
    meta: {
      contentClass: 'ecommerce-application',
    },
  },
  {
    path: '/apps/product/edit/:id',
    name: 'apps-product-edit',
    component: () => import('@/views/apps/product/product-edit/ProductEdit.vue'),
    meta: {
      contentClass: 'ecommerce-application',
    },
  },
  {
    path: '/apps/stocks/list',
    name: 'apps-stocks-list',
    component: () => import('@/views/apps/stock/stocks-list/StocksList.vue'),
  },
  {
    path: '/apps/stocks/history',
    name: 'apps-stocks-history',
    component: () => import('@/views/apps/stock/stocks-history/StocksHistory.vue'),
  },
  {
    path: '/apps/stocks/transfer',
    name: 'apps-stocks-transfer',
    component: () => import('@/views/apps/stock/stocks-transfer/StocksTransfer.vue'),
  },
  {
    path: '/apps/stocks/view/:id',
    name: 'apps-stocks-view',
    component: () => import('@/views/apps/stock/stocks-view/StocksView.vue'),
  },
]
