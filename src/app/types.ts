import {History} from 'history';
import {Store} from 'redux';

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

export interface ModelApi {}

export interface AppApi {
  setModels?: (models: Array<ModelApi | Array<ModelApi>>) => void;
  setRouter?: (router: (app: AppApi) => JSX.Element) => void;
  history?: History;
  store?: Store;
}

export type OnReducerApi = (
  newState: any,
  state: any,
  action: any,
  status: string
) => any;
