/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import permissions from '@/utils/permissions'

const estimate = (initialState:any) =>{
  let authorityList:[] = []
  let userRouters = null
  if (initialState?.currentUser){
    userRouters = initialState?.currentUser?.currentLoginAccountUserPermissions
  }
  const recursion = (datas: any) =>{
    datas?.forEach((item: any)=>{
      if (item.name){
        authorityList.push(item?.name)
      }
      if (item?.children && item?.children.length > 0){
        recursion(item.children)
      }
    })
  }
  recursion(userRouters)
  return authorityList
}

export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const jurisdictions = {}
  const {permissionLists} = permissions
  const powerLists = estimate(initialState)
  for (const Key in permissionLists) {
    jurisdictions[Key] = powerLists?.includes(permissionLists[Key])
  }
  return jurisdictions;
}
