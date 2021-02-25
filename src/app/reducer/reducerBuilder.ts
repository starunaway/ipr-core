import {ModelApi, OnReducerApi} from '../types';
import {combineReducers, Reducer} from 'redux';
import {isStateLegal} from './utils';
import {isFunction} from '@/utils/isType';

/**
 *
 * 创建reducer
 *
 * @param options
 * @param onReducer
 */
function reducerBuilder(
  options: Array<ModelApi>,
  onReducer?: OnReducerApi
): Reducer {
  const reducers = {};
  const reducerGroups = new Map();

  options.forEach((reducer) => {
    if (!reducer.key) {
      throw new Error('you should define a key ');
    }
    collectReducers(reducerGroups, reducer);
  });

  for (const [key, reducerGroup] of reducerGroups.entries()) {
    reducers[key] = buildReducerGroup(reducerGroup, onReducer as OnReducerApi);
  }

  return combineReducers(reducers);
}

type GroupType = Map<string, ModelApi>;

/**
 * 将models 按一级key分组
 *
 * @param reducers
 * @param reducer
 */
function collectReducers(
  reducerGroups: Map<string, GroupType>,
  reducer: ModelApi
) {
  const keys = reducer.key.split('.');
  const [groupKey, ...subKeys] = keys;
  let group = reducerGroups.get(groupKey);
  if (!group) {
    group = new Map();
    reducerGroups.set(groupKey, group);
  }

  if (keys.length === 1) {
    reducer.single = true;
  } else {
    reducer.subKeys = subKeys;
  }

  if (group.get(groupKey) || (group.size && reducer.single)) {
    throw new Error(
      `You have duplicate deinfine ${groupKey} or ${groupKey}'s subkey `
    );
  }

  if (group.get(reducer.key)) {
    throw new Error(`You have duplicate deinfine ${reducer.key}`);
  }

  group.set(reducer.key, reducer);
}

/**
 * 创建一级 key 下的reducer
 * @param reducerGroup
 * @param onReducer
 */
function buildReducerGroup(reducerGroup: GroupType, onReducer?: OnReducerApi) {
  const handlers = {};
  let initialState = {};

  for (const reducer of reducerGroup.values()) {
    if (!isStateLegal(initialState, reducer)) {
      throw new Error(
        `Build ${reducer.key} state failure. Check if ${reducer.key}'s key or initialState is duplicate in it's father state`
      );
    }

    if (reducer.single) {
      initialState = reducer.initialState || {};
    } else {
      buildState(
        initialState,
        reducer.subKeys as string[],
        reducer.initialState
      );
    }

    //  使用 key 作为 action.type
    const action = reducer.key;

    // action可能需异步处理，注入不同的状态处理函数
    handlers[action] = createReducerHandler(
      reducer,
      'loading',
      (state: any, action: any) => {
        const {payload, ...other} = action;
        let newState = {
          result: null,
          payload,
          success: false,
          loading: true,
          ...other,
        };

        if (onReducer) {
          newState = onReducer(newState, state, action, 'loading');
        }
        return newState;
      }
    );
    handlers[`${action}__SUCCESS`] = createReducerHandler(
      reducer,
      'success',
      (state: any, action: any) => {
        const {done, result, payload, ...other} = action;
        let newState = {};

        if (done) {
          newState = result;
        } else {
          newState = {
            result,
            payload,
            success: true,
            loading: false,
            ...other,
          };
        }

        if (onReducer) {
          newState = onReducer(newState, state, action, 'loading');
        }
        return newState;
      }
    );
    handlers[`${action}__FAILURE`] = createReducerHandler(
      reducer,
      'failure',
      (state: any, action: any) => {
        const {payload, error, ...other} = action;
        let newState = {
          payload,
          error,
          success: false,
          loading: false,
          ...other,
        };
        if (onReducer) {
          newState = onReducer(newState, state, action, 'loading');
        }
        return newState;
      }
    );
  }
  return createReducer(initialState, handlers);
}

/**
 * 构建 group 对应的多级state
 * @param groupState
 * @param keys
 * @param subState
 */
function buildState(
  groupState: object,
  keys: Array<string>,
  subState = {}
): void {
  const length = keys.length;
  if (length === 1) {
    groupState[keys[0]] = subState;
    return;
  }

  let top = groupState;

  keys.forEach((key, index) => {
    if (index !== length - 1) {
      let goNext = top[key];
      if (!goNext) {
        top[key] = {};
        goNext = top[key];
      }
      top = goNext;
    } else {
      top[key] = subState;
    }
  });
}

/**
 * 创建不同类型的action对应的reducer
 * @param reducer
 * @param method
 * @param handler
 */
function createReducerHandler(
  reducer: ModelApi,
  method: string,
  handler: (state: any, action: any) => any
) {
  return (state: any, action: any) => {
    let result;

    if (reducer[method] && !isFunction(reducer[method])) {
      throw new Error(`${reducer.key}'s ${method} must be function `);
    }

    if (reducer[method]) {
      result = reducer[method](state, action);
    } else {
      result = handler(state, action);
    }

    //  根据层级的不同进行处理
    if (reducer.single) {
      state = result;
    } else {
      state = {...state};
      buildState(state, reducer.subKeys as string[], result);
    }

    return state;
  };
}

/**
 * 创建reducer -> 组级别的根reducer
 *
 * @param initialState
 * @param hanlers
 */
function createReducer(initialState: object, handlers: object) {
  return (state: any = initialState, action: any) => {
    if (!action || !action.type) {
      return state;
    }

    const handler = handlers[action.type];
    const newState = !handler ? state : handler(state, action);

    if (!action.type.includes('__FAILURE')) {
      delete newState.error;
    }
    return newState;
  };
}

export default reducerBuilder;
