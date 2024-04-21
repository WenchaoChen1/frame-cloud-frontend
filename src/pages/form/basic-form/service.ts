import { request } from '@umijs/max';

export async function fakeSubmitForm(params: any) {
  return request('/mock/basicForm', {
    method: 'POST',
    data: params,
  });
}
