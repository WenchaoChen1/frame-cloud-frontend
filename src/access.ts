/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log(currentUser, '******')
  // debugger
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    welcomePermission: estimate(initialState,'welcomePermission'),
    systemManagement:estimate(initialState,'systemManagement'),
    identityManagement:estimate(initialState,'identityManagement'),
    dashboardPermission:estimate(initialState,'dashboardPermission'),
    formPermission:estimate(initialState,'formPermission'),
    listPermission:estimate(initialState,'listPermission'),
    profilePermission:estimate(initialState,'profilePermission'),
    resultPermission:estimate(initialState,'resultPermission'),
    exceptionPermission:estimate(initialState,'exceptionPermission'),
    accountPermission:estimate(initialState,'accountPermission'),
  };
}
const estimate = (initialState:any,permissionName:string) =>{
  let flag = false
  console.log(initialState?.currentUser, '=====***', permissionName)
  if (initialState?.currentUser){
    const {currentLoginAccountUserPermissions:userRouters} = initialState?.currentUser
    flag = userRouters?.some((item: any )=>item.code === permissionName);
  }
  console.log(flag, '查看权限')
  return flag
}
