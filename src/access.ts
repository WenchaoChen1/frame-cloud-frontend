/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import permissions from '@/utils/permissions'


export default function access(initialState: { currentUser?: any } | undefined) {
  const jurisdictions: { [key: string]: boolean } = {};
  const { permissionLists, permissionButton } = permissions;
  const powerLists = initialState?.currentUser?.pagePathAccessPermission;
  const buttonLists = initialState?.currentUser?.functionPermissionCode;

  for (const key in permissionLists) {
    const permissionName = permissionLists[key];
    jurisdictions[key] = !!powerLists?.includes(permissionName);
  }

  for (const key in permissionButton) {
    const permissionName = permissionButton[key];
    jurisdictions[key] = !!buttonLists?.includes(permissionName);
  }

  return jurisdictions;
}