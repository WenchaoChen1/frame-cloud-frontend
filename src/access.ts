/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
// import permissions from '@/utils/permissions'
import {handlePermission,handleButtonPermission} from '@/utils/permissionDatas'


export default function access(initialState: { currentUser?: any } | undefined) {
  const jurisdictions: { [key: string]: boolean } = {};
  // const { permissionLists, permissionButton } = permissions;
  const powerLists = initialState?.currentUser?.pagePathAccessPermission;
  const buttonLists = initialState?.currentUser?.functionPermissionCode;

  // for (const key in permissionLists) {
  //   const permissionName = permissionLists[key];
  //   jurisdictions[key] = !!powerLists?.includes(permissionName);
  // }
  //
  // for (const key in permissionButton) {
  //   const permissionName = permissionButton[key];
  //   jurisdictions[key] = !!buttonLists?.includes(permissionName);
  // }
   // return jurisdictions;
  return{
    // ...jurisdictions,
    routePermission:(foo)=>handlePermission(foo?.name,powerLists),
    buttonPermission:(foo)=> handleButtonPermission(foo?.name,buttonLists)
  }
}

//TODO 用注释中的写法  当前业务代码知道我当前是哪个权限么？
// src/access.ts
// export default function (initialState) {
//   const { userId, role } = initialState;
//
//   return {
//     canReadFoo: true,
//     canUpdateFoo: role === 'admin',
//     canDeleteFoo: (foo) => {
//       return foo.ownerId === userId;
//     },
//   };
// }
