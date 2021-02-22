import {onEffect} from '@/utils/reduxUtils';

export interface AppOptions {
  onEffect?: () => any;
  onFetchOption?: () => any;
  onReducer?: () => any;
  historyType?: any;
}

export enum HistoryType {
  HASH = 'HASH',
  BROWSER = 'BROWSER',
}
