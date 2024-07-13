import {request} from '@umijs/max';

export async function enums() {
  return request<APISystem.DirctDataType>(`${process.env.FRAME_SYSTEM_SERVICE}/v1/system/constant/enums`, {
    method: 'GET'
  });
}
