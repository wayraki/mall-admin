import React from 'react'
import Home from './pages/home'
import Product from './pages/pcm/product'

const routes = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/pcm',
    exact: true,
    component: Product,
    routes: [
      {
        path: '/product',
        exact: true,
        component: Product
      }
      // {
      //   path: '/child/:id',
      //   component: Child,
      //   routes: [
      //     {
      //       path: '/child/:id/grand-child',
      //       component: GrandChild
      //     }
      //   ]
      // }
    ]
  }
]

export default routes
