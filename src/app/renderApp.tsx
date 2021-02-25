import IprApp from './index';
import {Provider} from 'react-redux';
// import {createStore} from 'redux';

// function reducer(state: any = 'test reducer', action: any) {
//   switch (action.type) {
//     case 'add':
//       return state + action.payload.value;
//     default:
//       return state;
//   }
// }

// const store = createStore(reducer);

function renderApp(app: IprApp): JSX.Element | void {
  if (app.router) {
    return <Provider store={app.store}> {app.router(app)} </Provider>;
  }

  throw new Error(' app.setRouter() must be called ');
}

export default renderApp;
