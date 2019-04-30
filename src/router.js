import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: () => import('./components/HelloWorld')
    },
    {
      path: '/checkplan',
      name: 'checkplan',
      component: () => import('./components/checkplan')
    },
    {
      path: '/fixtureconfig',
      name: 'fixtureconfig',
      component: () => import('./components/fixtureconfig')
    },
    {
      path: '/fixtureconfiguration',
      name: 'fixtureconfiguration',
      component: () => import('./components/fixtureconfiguration'),
      children: [
        {
          path: 'fixtureimport',
          name: '/fixtureimport',
          component: () => import('./components/fixtureconfigurationchildren/fixtureimport')
        },
        {
          path: 'stockinquiry',
          name: 'stockinquiry',
          component: () => import('./components/fixtureconfigurationchildren/stockinquiry')
        },
        {
          path: 'unavailablefixture',
          name: 'unavailablefixture',
          component: () => import('./components/fixtureconfigurationchildren/unavailablefixture')
        }
      ]
    },
    {
      path: '/PCplanadjustmentverification',
      name: 'PCplanadjustmentverification',
      component: () => import('./components/PCplanadjustmentverification')
    },
    {
      path: '/planimport',
      name: 'planimport',
      component: () => import('./components/planimport')
    },
    {
      path: '/projectfixturerequirements',
      name: 'projectfixturerequirements',
      component: () => import('./components/projectfixturerequirements')
    },
    {
      path: '/table',
      name: 'table',
      component: () => import('./components/table')
    },
    {
      path: '/refresh',
      naem: 'refresh',
      component:() => import('./components/refresh')
    }
  ]
})
