import { request } from '@umijs/max';
import type { ActivitiesType, AnalysisData, NoticeType } from './data';

export async function queryProjectNotice(): Promise<{ data: NoticeType[] }> {
  return request('/mock/project/notice');
}

export async function queryActivities(): Promise<{ data: ActivitiesType[] }> {
  return request('/mock/activities');
}

export async function fakeChartData(): Promise<{ data: AnalysisData }> {
  return request('/mock/fake_workplace_chart_data');
}
