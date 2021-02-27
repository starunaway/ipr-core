import {applyMiddleware, compose, createStore} from 'redux';

/**
 * 创建redux.store
 * @param opts
 */
function createIprStore(opts: any) {
  const {reducers, initialState, sagaMiddleware} = opts;

  let middlewares = [];
  if (sagaMiddleware) {
    middlewares.push(sagaMiddleware);
  }

  let devTools = () => (n: any) => n;
  if (
    process.env.NODE_ENV !== 'production' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__
  ) {
    devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  }

  const enhancers = [applyMiddleware(...middlewares), devTools()];

  return createStore(reducers, initialState, compose(...enhancers));
}

export default createIprStore;
