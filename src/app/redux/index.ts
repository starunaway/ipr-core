import {applyMiddleware, compose, createStore} from 'redux';

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

  console.log(process.env.NODE_ENV);

  const enhancers = [applyMiddleware(...middlewares), devTools()];

  return createStore(reducers, initialState, compose(...enhancers));
}

export default createIprStore;
