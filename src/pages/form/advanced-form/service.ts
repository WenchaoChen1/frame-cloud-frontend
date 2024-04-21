import { request } from '@umijs/max';

export async function fakeSubmitForm(params: any) {
  return request('/mock/advancedForm', {
    method: 'POST',
    data: params,
  });
}
