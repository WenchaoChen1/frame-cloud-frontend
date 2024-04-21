import { request } from '@umijs/max';
import type { ListItemDataType, Params } from './data.d';

export async function queryFakeList(
  params: Params,
): Promise<{ data: { list: ListItemDataType[] } }> {
  return request('/mock/fake_list', {
    params,
  });
}
