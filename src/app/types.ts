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

export type ReducerHandler = (state: any, action: any) => any;

export interface ModelApi {
  key: string;
  subKeys?: Array<string>;
  action?: string;
  initialState?: any;
  method?: string;
  url?: (payload: any) => string;
  single?: boolean;
  headers?: object;
  body?: () => any;
  payload?: any;
  loading?: ReducerHandler;
  success?: ReducerHandler;
  failure?: ReducerHandler;
}

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
