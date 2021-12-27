import { asyncRouterMap, constantRouterMap } from '@/router/index';
import {admainRouterMap, studentRouterMap, teacherRouterMap} from "../../router";

//判断是否有权限访问该菜单
function hasPermission(menus, route) {
  if (route.name) {
    let currMenu = getMenu(route.name, menus);
    if (currMenu!=null) {
      //设置菜单的标题、图标和可见性
      if (currMenu.title != null && currMenu.title !== '') {
        route.meta.title = currMenu.title;
      }
      if (currMenu.icon != null && currMenu.title !== '') {
        route.meta.icon = currMenu.icon;
      }
      if(currMenu.hidden!=null){
        route.hidden = currMenu.hidden !== 0;
      }
      if (currMenu.sort != null && currMenu.sort !== '') {
        route.sort = currMenu.sort;
      }
      return true;
    } else {
      route.sort = 0;
      if (route.hidden !== undefined && route.hidden === true) {
        route.sort=-1;
        return true;
      } else {
        return false;
      }
    }
  } else {
    return true
  }
}

//根据路由名称获取菜单
function getMenu(name, menus) {
  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i];
    if (name===menu.name) {
      return menu;
    }
  }
  return null;
}

//对菜单进行排序
function sortRouters(accessedRouters) {
  for (let i = 0; i < accessedRouters.length; i++) {
    let router = accessedRouters[i];
    if(router.children && router.children.length > 0){
      router.children.sort(compare("sort"));
    }
  }
  accessedRouters.sort(compare("sort"));
}

//降序比较函数
function compare(p){
  return function(m,n){
    let a = m[p];
    let b = n[p];
    return b - a;
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        console.log(data)
        const username = data
        let accessedRouters1
        if (username === 'student') {
          accessedRouters1 = studentRouterMap
        } else if (username === 'teacher') {
          accessedRouters1 = teacherRouterMap
        } else if (username === 'admain') {
          accessedRouters1 = admainRouterMap
        }
        const accessedRouters = accessedRouters1
        console.log(accessedRouters)
        //对菜单进行排序
        sortRouters(accessedRouters);
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
};

export default permission;

