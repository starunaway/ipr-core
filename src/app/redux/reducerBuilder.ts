import {ModelApi, OnReducerApi} from '../types';
import {combineReducers} from 'redux';

export function reducerBuilder(models: object, onReducer?: OnReducerApi) {
  const reducers = {};
  return combineReducers(reducers);
}

// export  reducerBuilder;
