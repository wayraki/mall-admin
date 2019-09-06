export default [
  { path: '/admin', redirect: '/admin/dashboard' },
  {
    path: '/admin/dashboard',
    breadcrumb: 'dashboard',
    icon: 'dashboard',
    routes: [
      { path: '/admin/dashboard', redirect: '/admin/dashboard/analysis' },
      {
        path: '/admin/dashboard/analysis',
        component: './Dashboard/Analysis',
        breadcrumb: 'analysis'
      }
    ]
  },
  {
    path: '/admin/shop',
    breadcrumb: 'shop',
    icon: 'shop',
    routes: [
      { path: '/admin/shop', redirect: '/admin/shop/list' },
      {
        path: '/admin/shop/analysis',
        component: './Dashboard/Analysis',
        breadcrumb: 'analysis'
      }
    ]
  },
  {
    component: '404'
  }
]
