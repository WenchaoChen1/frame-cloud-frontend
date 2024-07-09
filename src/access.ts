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