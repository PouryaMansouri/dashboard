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
    path: '/email-login',
    name: 'email-login',
    component: () => import('@/views/pages/authentication/Email-login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/pages/app/Products.vue'),
    meta: {
      pageTitle: 'Products',
    },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/pages/app/Users.vue'),
    meta: {
      pageTitle: 'Users',
    },
  },
]
