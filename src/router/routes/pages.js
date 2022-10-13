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
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    }
  },
  {
    path: '/apps/categories/edit/:id',
    name: 'apps-categories-edit',
    component: () => import('@/views/apps/category/categories-edit/CategoriesEdit.vue'),
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    }
  },
  {
    path: '/apps/color/list',
    name: 'apps-colors-list',
    component: () => import('@/views/apps/color/colors-list/ColorsList.vue'),
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    }
  },
  {
    path: '/apps/colors/edit/:id',
    name: 'apps-colors-edit',
    component: () => import('@/views/apps/color/colors-edit/ColorsEdit.vue'),
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    }
  },
  {
    path: '/apps/size/list',
    name: 'apps-sizes-list',
    component: () => import('@/views/apps/size/sizes-list/SizesList.vue'),
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    }
  },
  {
    path: '/apps/sizes/edit/:id',
    name: 'apps-sizes-edit',
    component: () => import('@/views/apps/size/sizes-edit/SizesEdit.vue'),
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    }
  },
  {
    path: '/apps/feature/list',
    name: 'apps-features-list',
    component: () => import('@/views/apps/feature/features-list/FeaturesList.vue'),
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    }
  },
  {
    path: '/apps/features/edit/:id',
    name: 'apps-features-edit',
    component: () => import('@/views/apps/feature/features-edit/FeaturesEdit.vue'),
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    }
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
    path: '/apps/supplier/list',
    name: 'apps-suppliers-list',
    component: () => import('@/views/apps/supplier/suppliers-list/SuppliersList.vue'),
  },
  {
    path: '/apps/suppliers/edit/:id',
    name: 'apps-suppliers-edit',
    component: () => import('@/views/apps/supplier/suppliers-edit/SuppliersEdit.vue'),
  },
  {
    path: '/apps/brands/list',
    name: 'apps-brands-list',
    component: () => import('@/views/apps/brand/brands-list/BrandsList.vue'),
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    }
  },
  {
    path: '/apps/brands/edit/:id',
    name: 'apps-brands-edit',
    component: () => import('@/views/apps/brand/brands-edit/BrandsEdit.vue'),
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    }
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
    path: '/apps/comments/pending',
    name: 'apps-comments-pending',
    component: () => import('@/views/apps/comment/comments-list/CommentsListPending.vue'),
  },
  {
    path: '/apps/comments/all',
    name: 'apps-comments-all',
    component: () => import('@/views/apps/comment/comments-list/CommentsListAll.vue'),
  },
  {
    path: '/apps/product/list',
    name: 'apps-products-list',
    component: () => import('@/views/apps/product/products-list/ProductsList.vue'),
    meta: {
      contentRenderer: 'sidebar-left-detached',
      contentClass: 'ecommerce-application',
      resource: 'stockKeeper',
      action: 'read'
    },
  },
  {
    path: '/apps/product/:id',
    name: 'apps-product-details',
    component: () => import('@/views/apps/product/product-details/ProductDetails.vue'),
    meta: {
      contentClass: 'ecommerce-application',
      resource: 'stockKeeper',
      action: 'read'
    },
  },
  {
    path: '/apps/product/edit/:id',
    name: 'apps-product-edit',
    component: () => import('@/views/apps/product/product-edit/ProductEdit.vue'),
    meta: {
      contentClass: 'ecommerce-application',
      resource: 'stockKeeper',
      action: 'read'
    },
  },
  {
    path: '/apps/logs/list',
    name: 'apps-logs-list',
    component: () => import('@/views/apps/log/logs-list/LogsList.vue'),
  },
  {
    path: '/apps/stocks/list',
    name: 'apps-stocks-list',
    component: () => import('@/views/apps/stock/stocks-list/StocksList.vue'),
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    },
  },
  {
    path: '/apps/stocks/view',
    name: 'apps-stocks-view',
    component: () => import('@/views/apps/stock/stocks-list/StocksView.vue'),
    meta: {
      resource: 'verbal',
      action: 'read',
    }
  },
  {
    path: '/apps/stocks/online',
    name: 'apps-stocks-online',
    component: () => import('@/views/apps/stock/stocks-online/StocksOnline.vue'),
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    }
  },
  {
    path: '/apps/stocks/history',
    name: 'apps-stocks-history',
    component: () => import('@/views/apps/stock/stocks-history/StocksHistory.vue'),
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    },
  },
  {
    path: '/apps/suppliers/history/:id',
    name: 'apps-suppliers-history',
    component: () => import('@/views/apps/supplier/suppliers-history/SuppliersHistory.vue'),
  },
  {
    path: '/apps/stocks/transfer',
    name: 'apps-stocks-transfer',
    component: () => import('@/views/apps/stock/stocks-transfer/StocksTransfer.vue'),
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    },
  },
  {
    path: '/apps/stocks/detail/:id',
    name: 'apps-stocks-detail',
    component: () => import('@/views/apps/stock/stocks-view/StocksView.vue'),
    meta: {
      resource: 'stockKeeper',
      action: 'read'
    },
  },
  {
    path: '/apps/orders/list-pending',
    name: 'apps-orders-list-pending',
    component: () => import('@/views/apps/order/orders-list-pending/OrdersListPending.vue'),
  },
  {
    path: '/apps/orders/list',
    name: 'apps-orders-list',
    component: () => import('@/views/apps/order/orders-list/OrdersList.vue'),
  },
  {
    path: '/apps/affiliates/links/list',
    name: 'apps-affiliates-links-list',
    component: () => import('@/views/apps/affiliate/affiliate-links-list/AffiliateLinksList.vue'),

  },
  {
    path: '/apps/affiliates/accounts/list',
    name: 'apps-affiliates-accounts-list',
    component: () => import('@/views/apps/affiliate/affiliate-accounts-list/AffiliateAccountsList.vue'),
  },
  {
    path: '/apps/customers/list',
    name: 'apps-customers-list',
    component: () => import('@/views/apps/customer/customers-list/CustomersList.vue'),
  },
  {
    path: '/apps/customers/view/:id',
    name: 'apps-customers-view',
    component: () => import('@/views/apps/customer/customers-view/CustomersView.vue'),
  },
  {
    path: '/apps/customers/carts/list',
    name: 'apps-customers-carts-list',
    component: () => import('@/views/apps/customer/customersCarts-list/CustomersCartsList.vue'),
  },
  {
    path: '/apps/customers/orders/list',
    name: 'apps-customers-orders-list',
    component: () => import('@/views/apps/customer/customersOrders-list/CustomersOrdersList.vue'),
  },
  {
    path: '/apps/shop/verbal',
    name: 'apps-shop-verbal',
    component: () => import('@/views/apps/verbal/shop-verbal/ShopVerbal.vue'),
    meta: {
      resource: 'verbal',
      action: 'read',
    },
  },
  {
    path: '/apps/shop/:id/verbal',
    name: 'apps-verbal',
    component: () => import('@/views/apps/verbal/verbal-list/VerbalList.vue'),
    meta: {
      resource: 'verbal',
      action: 'read'
    },
  },
]
