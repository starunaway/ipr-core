import {fork, call, put, takeEvery} from 'redux-saga/effects';
import {ModelApi} from '../types';

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

function createSaga(model: ModelApi, args: any) {
  //   const {onFetchOption, onEffect, history} = args;
  console.log(args, model.key);
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
        const response: {} = yield call(Api.getUser, action);
        if (response) {
          putAction = {
            type: `${model.key}__${
              (response as any).status === 200 ? 'SUCCESS' : 'FAILURE'
            }`,
            payload: (action as any).payload,
            success: (response as any).status === 200,
            loading: false,
            //    不加yield ？
            result: (response as any).json(),
          };

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

function Api() {}
Api.getUser = function (...args: any): any {
  console.log('Api.getUser', ...args);
  return new Promise((resolve) => resolve(666));
};

export default sagaBuilder;
