import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  /*NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
      console.log(1)
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          let menus=res.data.menus;
          let username=res.data.username;
          store.dispatch('GenerateRoutes', { menus,username }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
            next({ ...to, replace: true })
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
        console.log(2)
      } else {
        next()
        console.log(3)
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
    console.log(4)
  }
  //if (userdata.username === '') {
    //next('/login')
  //}*/
  let t
  next()
})

router.afterEach(() => {
  /*let menus
  let username = 'admin'
  store.dispatch('GenerateRoutes', { menus,username }).then(() => { // 生成可访问的路由表
   router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
  })*/
})
