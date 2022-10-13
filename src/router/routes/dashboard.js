export default [
  {
    path: '/dashboard/analytics',
    name: 'dashboard-analytics',
    component: () => import('@/views/dashboard/ecommerce/Ecommerce.vue'),
  },
  // {
  //   path: '/dashboard/ecommerce',
  //   name: 'dashboard-ecommerce',
  //   component: () => import('@/views/dashboard/ecommerce/Ecommerce.vue'),
  //   meta: {
  //     resource: 'ecc',
  //     action: 'read',
  //   },
  // },
]
