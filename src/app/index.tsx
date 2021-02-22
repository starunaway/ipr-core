import ReactDOM from 'react-dom';
import {isHTMLElement} from '@/utils/isType';
import React from 'react';
import renderApp from './renderApp';
import Page from '@/pages/index';

class IprApp {
  start = (container: string | Element | null) => {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }

    if (isHTMLElement(container)) {
      this.render(container);
    }
  };
  router = (route: any) => {
    this.router = route;
  };
  models = () => {};

  render = (container: Element | null) => {
    ReactDOM.render(<Page />, container);
  };
}

export default IprApp;
