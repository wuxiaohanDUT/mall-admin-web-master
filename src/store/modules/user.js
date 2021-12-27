import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: '',
    userName: '',
    avatar: '',
    roles: [],
    type: '',
    password: '',
    college: '',
    userId:'',
    userPhoneNumber:'',
    userEmail:'',
    userGender:'',
    userCollege:'',
    userClass:'',
    userType:''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ALL: (state, data) => {
      state.userId = data.userId
      state.token = data.token
      state.userEmail = data.userEmail
      state.userClass = data.userClass
      state.userName = data.userName
      state.userGender = data.userGender
      state.userType = data.userType
      state.userPhoneNumber = data.userPhoneNumber
    },
    SET_PHONE_NUMBER: (state, number) => {
      state.userPhoneNumber = number
    },
    SET_EMAIL: (state, email) => {
      state.userEmail = email
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          const tokenStr = data.tokenHead+data.token
          setToken(tokenStr)
          commit('SET_TOKEN', tokenStr)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.username)
          commit('SET_AVATAR', data.icon)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    SetUserData({commit}, result) {
      console.log(result)
      commit('SET_ALL', result)
    },
    SetEmailAndNumber({commit}, data) {
      commit('SET_PHONE_NUMBER', data.get('number'))
      commit('SET_EMAIL', data.get('email'))
    },
  }
}

export default user
