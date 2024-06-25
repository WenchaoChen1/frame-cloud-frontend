/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    systemManagement:estimate(initialState,'systemManagement'),
    identityManagement:estimate(initialState,'identityManagement'),
    exceptionPermission:estimate(initialState,'exceptionPermission'),
    // TODO
    // welcomePermission: estimate(initialState,'welcomePermission'),
    // dashboardPermission:estimate(initialState,'dashboardPermission'),
    // formPermission:estimate(initialState,'formPermission'),
    // listPermission:estimate(initialState,'listPermission'),
    // profilePermission:estimate(initialState,'profilePermission'),
    // resultPermission:estimate(initialState,'resultPermission'),
    // accountPermission:estimate(initialState,'accountPermission'),
  };
}
const estimate = (initialState:any,permissionName:string) =>{
  let flag = false
  if (initialState?.currentUser){
    const {currentLoginAccountUserPermissions:userRouters} = initialState?.currentUser
    flag = userRouters?.some((item: any )=>item.code === permissionName);
  }
  return flag
}
