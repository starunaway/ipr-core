import ReactDOM from 'react-dom';
import {isHTMLElement} from '@/utils/isType';

class IprApp {
  _router?: (app: IprApp) => JSX.Element;

  //   constructor(opts: AppOptions) {}

  start(container: string | Element | null) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }

    if (isHTMLElement(container)) {
      this.render(container);
    }
  }
  router(router: (app: IprApp) => JSX.Element) {
    this._router = router;
  }
  models = () => {};

  render(container: Element | null) {
    ReactDOM.render(renderApp(this), container);
  }
}

function renderApp(app: any): JSX.Element {
  return <> {app._router(app)} </>;
}

export default IprApp;
