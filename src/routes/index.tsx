import {BrowserRouter, Route, Switch} from 'react-router-dom';
import IprApp from '@/app';
import Home from '@/pages/home';
import Login from '@/pages/login';

function RouteApp(app: IprApp) {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' exact component={Login} />
        <Route path='/' component={Home}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default RouteApp;
