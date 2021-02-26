import {isFunction} from '@/utils/isType';
import {fork, call, put, takeEvery} from 'redux-saga/effects';
import {AppOptions, ModelApi} from '../types';
import axios from 'axios';

function sagaBuilder(models: Array<ModelApi | Array<ModelApi>>, args: any) {
  const sagaModels = models.flat();
  const sagaArr: any = [];
  sagaModels.forEach((sagaModel) => {
    if (sagaModel.url) {
      sagaArr.push(createSaga(sagaModel, args));
    }
  });

  return function* () {
    for (let saga of sagaArr) {
      yield fork(saga);
    }
  };
}

type PutAction = {
  type: string;
  payload: any;
  loading?: boolean;
  success?: boolean;
  status?: number;
  message?: string;
  result?: any;
  url?: string;
  error?: any;
};

type CreateOptions = AppOptions & {
  history: History;
};

function createSaga(model: ModelApi, args: CreateOptions) {
  const {onFetchOption, onEffect, history} = args;
  return function* () {
    //    处理 action 对应的 网络请求
    yield takeEvery(model.key, function* (action) {
      console.log(action);
      let putAction: PutAction = {
        type: `${model.key}__LOADING`,
        payload: (action as any).payload,
        loading: true,
        success: false,
        result: null,
      };

      yield put(putAction);

      try {
        let options = createOption(model, (action as any).payload);
        if (isFunction(onFetchOption)) {
          options = onFetchOption && onFetchOption(options, model);
        }

        const response: {} = yield call(axios, options);

        if (response) {
          if (onEffect) {
            putAction.url = (model as any).url((action as any).payload);
            putAction = yield onEffect(putAction, response, history);
          } else {
            putAction = {
              type: '',
              payload: (action as any).payload,
              success: (response as any).status === 200,
              loading: false,
              //    不加yield ？
              result: (response as any).json(),
            };
          }
          putAction.type = `${model.key}__${
            (response as any).status === 200 ? 'SUCCESS' : 'FAILURE'
          }`;

          yield put(putAction);
        }
        // const type = model.type || 'json';
      } catch (error) {
        putAction = {
          type: `${model.key}__FAILURE`,
          payload: (action as any).payload,
          success: false,
          loading: false,
          result: null,
          error: error || '请求异常',
        };
        yield put(putAction);
      }
    });
  };
}

function createOption(model: ModelApi, payload: any) {
  const {method, type = 'json', headers, bodyParser} = model;
  const option: any = {};
  option.method = method || 'get';
  option.url = (model.url as any)(payload);
  option.headers = headers || {
    Accept: 'application/json',
    'Content-Type':
      type === 'json'
        ? 'application/json'
        : 'application/x-www-form-urlencoded',
  };

  if (option.method !== 'get' && payload) {
    if (bodyParser) {
      option.data = bodyParser(payload);
    } else {
      if (type === 'json') {
        option.data = JSON.stringify(payload);
      } else if (type === 'form') {
        let pairs = [];
        for (let key of payload) {
          pairs.push(key + '=' + payload[key]);
        }
        option.data = pairs.join('&');
      } else {
        option.data = payload;
      }
    }
  }

  return option;
}

export default sagaBuilder;
