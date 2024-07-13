import {request} from '@umijs/max';

export async function enums() {
  return request(`${process.env.FRAME_IDENTITY_SERVICE}/v1/authorize/constant/enums`, {
    method: 'GET'
  });
}
