import ReactDOM from 'react-dom';
import {isHTMLElement} from '@/utils/isType';
import {createBrowserHistory, createHashHistory, History} from 'history';
import {AppOptions, HistoryType} from './types';

class IprApp {
  _router?: (app: IprApp) => JSX.Element;
  history: History;
  constructor(opts: AppOptions) {
    const {historyType} = opts;
    this.history = createBrowserHistory();

    switch (historyType) {
      case HistoryType.HASH:
        this.history = createHashHistory();
        break;
      default:
        this.history = createBrowserHistory();
        break;
    }
  }

  start(container: string | Element | null) {
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

    if (!this._router) {
      throw new Error(` app.setRouter() must be called before app.start() `);
    }
    this.render(container);
  }
  setRouter(router: (app: IprApp) => JSX.Element) {
    this._router = router;
  }
  setModels = () => {};

  render(container: Element | null): void {
    const dom = renderApp(this);
    if (dom) {
      ReactDOM.render(dom, container);
    }
  }
}

function renderApp(app: IprApp): JSX.Element | void {
  if (app._router) {
    return <> {app._router(app)} </>;
  }

  throw new Error(' app.setRouter() must be called ');
}

export default IprApp;
