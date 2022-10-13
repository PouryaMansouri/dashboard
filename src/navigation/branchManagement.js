export default [
  {
    title: 'Shops',
    icon: 'ShoppingBagIcon',
    route: 'apps-shops-list',
  },
  {
    title: 'Stock List',
    icon: 'BoxIcon',
    route: 'apps-stocks-list',
    resource: 'stockKeeper',
    action: 'read'
  },
  {
    title: 'Transfer',
    icon: 'ShareIcon',
    route: 'apps-stocks-transfer',
    resource: 'stockKeeper',
    action: 'read'
  },
  {
    title: 'History',
    icon: 'DatabaseIcon',
    route: 'apps-stocks-history',
    resource: 'stockKeeper',
    action: 'read'
  },
]