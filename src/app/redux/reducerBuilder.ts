import {ModelApi, OnReducerApi, ReducerHandler} from '../types';
import {combineReducers, Reducer} from 'redux';
import {isArray} from '@/utils/isType';

function reducerBuilder(
  options: Array<ModelApi | Array<ModelApi>>,
  onReducer?: OnReducerApi
): Reducer {
  const reducers = {};
  const reducerGroups = new Map();

  options.forEach((reducer, index) => {
    if (isArray(reducer)) {
      collectReducers(reducerGroups, reducer as Array<ModelApi>);
    } else {
      reducers[index] = reducer;
    }
  });

  //   for (let key in options) {
  //     if (options.hasOwnProperty(key)) {
  //       let reducer = options[key];
  //       if (reducer instanceof Array) {
  //         collectReducers(reducerGroups, reducer);
  //       } else {
  //         reducers[key] = reducer;
  //       }
  //     }
  //   }

  for (const [key, reducerGroup] of reducerGroups.entries()) {
    if (Reflect.has(reducers, key)) {
      throw Error('You have define duplicate key ' + key);
    }
    reducers[key] = initialReducerGroup(reducerGroup, onReducer);
  }

  return combineReducers(reducers);
}

type GroupType = Map<string, ModelApi>;

function collectReducers(
  reducerGroups: Map<string, GroupType>,
  reducers: Array<ModelApi>
) {
  reducers.forEach((reducer) => {
    const keys = reducer.key.split('.');
    const [groupKey, ...subKeys] = keys;
    let group = reducerGroups.get(groupKey);
    if (!group) {
      group = new Map();
      reducerGroups.set(groupKey, group);
    }

    if (subKeys.length === 0) {
      reducer.single = true;
    } else {
      reducer.subKeys = subKeys;
    }

    //  reducer.single 的判断可能需要去掉
    if (group.has(reducer.key) && !reducer.single) {
      throw Error('Duplicate key ' + reducer.key);
    }

    group.set(reducer.key, reducer);
  });
}

function initialReducerGroup(
  reducerGroup: GroupType,
  onReducer?: OnReducerApi
) {
  const handlers = {};
  let initialState = {};
  for (const reducer of reducerGroup.values()) {
    if (reducer.single) {
      initialState = reducer.initialState || {};
    } else {
      overrideState(initialState, reducer.subKeys, reducer.initialState);
    }

    const reducerAction = reducer.action || reducer.key;
    if (!reducerAction) {
      throw new Error('reducer.key not found');
    }

    handlers[reducerAction] = createReducerHandler(
      reducer,
      'loading',
      (state, action) => {
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
    handlers[`${reducerAction}_SUCCESS`] = createReducerHandler(
      reducer,
      'success',
      (state, action) => {
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
    handlers[`${reducerAction}_FAILURE`] = createReducerHandler(
      reducer,
      'failure',
      (state, action) => {
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
}

function overrideState(state: any, keys: Array<string>, value: any = {}) {
  // 当 key = "a.b.c.d.e"这种形式时，构建出层级结构
  //   todo 如果已经定义 a.b，定义一个 a.b.c.d结构会覆盖，反之亦然。需要报错

  const length = keys.length;
  if (length === 1) {
    state[keys[0]] = value;
    return;
  }

  let previous = state;
  for (let i = 0; i < length; i++) {
    if (i === length - 1) {
      previous[keys[i]] = value;
    } else {
      let next = previous[keys[i]];
      if (!next) {
        previous[keys[i]] = {};
        next = previous[keys[i]];
      }
      previous = next;
    }
  }
}
function createReducerHandler(
  reducer: ModelApi,
  method: string,
  handler: ReducerHandler
) {
  return (state: any, action: any) => {
    let result;
    if (reducer[method]) {
      result = reducer[method](state, action);
    } else {
      result = handler(state, action);
    }

    if (reducer.single) {
      state = result;
    } else {
      state = {...state};
      overrideState(state, reducer.subKeys, result);
    }
    return state;
  };
}

export default reducerBuilder;
