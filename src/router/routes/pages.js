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
    path: '/pages/profile',
    name: 'pages-profile',
    component: () => import('@/views/pages/profile/Profile.vue'),
    meta: {
      pageTitle: 'Profile',
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
    path: '/apps/products/list',
    name: 'apps-products-list',
    component: () => import('@/views/apps/product/products-list/ProductsList.vue'),
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
    path: '/apps/stocks/list',
    name: 'apps-stocks-list',
    component: () => import('@/views/apps/stock/stocks-list/StocksList.vue'),
  },
  {
    path: '/apps/stocks/edit/:id',
    name: 'apps-stocks-edit',
    component: () => import('@/views/apps/stock/stocks-edit/StocksEdit.vue'),
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
    path: '/apps/e-commerce/shop',
    name: 'apps-e-commerce-shop',
    component: () => import('@/views/apps/e-commerce/e-commerce-shop/ECommerceShop.vue'),
    meta: {
      contentRenderer: 'sidebar-left-detached',
      contentClass: 'ecommerce-application',
    },
  },
  {
    path: '/apps/e-commerce/:id',
    name: 'apps-e-commerce-product-details',
    component: () => import('@/views/apps/e-commerce/e-commerce-product-details/ECommerceProductDetails.vue'),
    meta: {
      contentClass: 'ecommerce-application',
    },
  },
  // {
  //   path: '/apps/products/view/:id',
  //   name: 'apps-products-view',
  //   component: () => import('@/views/apps/product/products-view/ProductsView.vue'),
  // },
  // {
  //   path: '/apps/products/edit/:id',
  //   name: 'apps-products-edit',
  //   component: () => import('@/views/apps/product/products-edit/ProductsEdit.vue'),
  // },
]
