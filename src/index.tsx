import '@/themes';
import App from '@/app';
import routes from '@/routes';

const app = new App({});

app.setRouter(routes);

app.start('#root');
