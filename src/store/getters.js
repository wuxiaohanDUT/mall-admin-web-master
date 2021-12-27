const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userName: state => state.user.userName,
  roles: state => state.user.roles,
  addRouters: state => state.permission.addRouters,
  routers: state => state.permission.routers,
  usertype: state => state.user.userType,
  userId: state => state.user.userId,
  userPhoneNumber: state => state.user.userPhoneNumber,
  userEmail: state => state.user.userEmail,
  userGender:state => state.user.userGender,
  userCollege:state => state.user.userCollege,
  userClass:state => state.user.userClass
}
export default getters
