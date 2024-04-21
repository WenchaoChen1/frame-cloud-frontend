import { request } from '@umijs/max';

export async function fakeSubmitForm(params: any) {
  return request('/mock/stepForm', {
    method: 'POST',
    data: params,
  });
}
