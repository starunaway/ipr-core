import ReactDOM from 'react-dom';
import {isHTMLElement} from '@/utils/isType';
import {createBrowserHistory, createHashHistory, History} from 'history';
import {AppOptions, HistoryType, AppApi, ModelApi, OnReducerApi} from './types';
import createSagaMiddleware from 'redux-saga';
import createStore from './reducer/createStore';
import reducerBuilder from './reducer/reducerBuilder';
import sagaBuilder from './reducer/sagaBuilder';
import renderApp from './renderApp';

class IprApp implements AppApi {
  router?: (app: IprApp) => JSX.Element;
  store: any;
  history: History;

  private onSuccess?: () => any;
  private onFetchOption?: AppOptions['onFetchOption'];
  private onReducer?: OnReducerApi;
  private models: any[];

  constructor(opts: AppOptions) {
    const {historyType, onSuccess, onFetchOption, onReducer} = opts;

    this.history = createBrowserHistory();
    this.models = [];
    this.onSuccess = onSuccess;
    this.onFetchOption = onFetchOption;
    this.onReducer = onReducer;

    switch (historyType) {
      case HistoryType.HASH:
        this.history = createHashHistory();
        break;
      default:
        this.history = createBrowserHistory();
        break;
    }
  }

  buildStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    let initialState = {};

    // 可以通过webpack注入全局的state
    // if ((window as any).__INITIAL_STATE__) {
    //   try {
    //     initialState =
    //       JSON.parse(Base64.decode((window as any).__INITIAL_STATE__)) || {};
    //   } catch (e) {
    //     console.error('parse window initial state error -> ', e);
    //   }
    // }

    const reducers = reducerBuilder(this.models, this.onReducer);

    this.store = createStore({
      reducers,
      initialState,
      sagaMiddleware,
    });

    (this.store as any).runSaga = sagaMiddleware.run;

    const sagas = sagaBuilder(this.models, {
      onSuccess: this.onSuccess,
      onFetchOption: this.onFetchOption,
      history: this.history,
    });

    sagaMiddleware.run(sagas);

    this.history = patchHistory(this.history);
  };

  start = (container: string | Element | null) => {
    if (typeof container === 'string') {
      let cElement = document.querySelector(container);
      if (!cElement) {
        throw new Error(`container ${container} not found`);
      }
      container = cElement;
    }

    if (!isHTMLElement(container)) {
      throw new Error(`container should be html element `);
    }

    if (!this.router) {
      throw new Error(` app.setRouter() must be called before app.start() `);
    }

    if (!this.store) {
      this.buildStore();
    }

    this.render(container);
  };
  setRouter = (router: (app: IprApp) => JSX.Element) => {
    this.router = router;
  };

  setModels = (models: Array<ModelApi | ModelApi[]>) => {
    this.models = [...models];
  };

  render = (container: Element | null): void => {
    const dom = renderApp(this);
    if (dom) {
      ReactDOM.render(dom, container);
    }
  };
}

function patchHistory(history: History) {
  const oldListen = history.listen;
  history.listen = (callback: any) => {
    callback(history.location);
    return oldListen.call(history, callback);
  };
  return history;
}

export default IprApp;
