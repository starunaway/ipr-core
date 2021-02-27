import {History} from 'history';
import {Store} from 'redux';

export interface AppOptions {
  onSuccess?: (action?: any, response?: any, history?: any) => any;
  onFetchOption?: (option: any, reducer: ModelApi) => any;
  onReducer?: ReducerHandler;
  historyType?: any;
}

export type PutAction = {
  type: string;
  payload: any;
  loading?: boolean;
  success?: boolean;
  status?: number;
  message?: string;
  result?: {} | null;
  url?: string;
  error?: any;
};

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
  bodyParser?: (payload: any) => any;
  payload?: any;
  loading?: ReducerHandler;
  success?: ReducerHandler;
  failure?: ReducerHandler;
  reducer?: ReducerHandler;
  type?: string;
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
