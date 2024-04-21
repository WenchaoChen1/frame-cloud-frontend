import { request } from '@umijs/max';
import type { CardListItemDataType } from './data.d';

export async function queryFakeList(params: {
  count: number;
}): Promise<{ data: { list: CardListItemDataType[] } }> {
  return request('/mock/card_fake_list', {
    params,
  });
}
