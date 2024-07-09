/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import permissions from '@/utils/permissions'


export default function access(initialState: { currentUser?: any } | undefined) {
  const jurisdictions: { [key: string]: boolean } = {};
  const { permissionLists } = permissions;
  const powerLists = initialState?.currentUser?.pagePathAccessPermission;;

  for (const key in permissionLists) {
    const permissionName = permissionLists[key];
    jurisdictions[key] = !!powerLists?.includes(permissionName);
  }

  return jurisdictions;
}

// const estimate = (initialState) =>{
//   let authorityList:[] = []
//   let userRouters = null
//   if (initialState?.currentUser){
//     userRouters = initialState?.currentUser?.leftAndTopRoutes
//   }
//   const recursion = (datas: any) =>{
//     datas?.forEach((item: any)=>{
//       if (item.name){
//         authorityList.push(item?.name)
//       }
//       if (item?.children && item?.children.length > 0){
//         recursion(item.children)
//       }
//     })
//   }
//   recursion(userRouters)
//   return authorityList
// }

// export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
//   const jurisdictions = {}
//   const {permissionLists} = permissions
//   const powerLists = estimate(initialState)
//   for (const Key in permissionLists) {
//     jurisdictions[Key] = powerLists?.includes(permissionLists[Key])
//   }
//   console.log(jurisdictions, '******')
//   return jurisdictions;
// }
