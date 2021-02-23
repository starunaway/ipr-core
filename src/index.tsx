import App from '@/app';
import routes from '@/routes';

const app = new App();

app.router(routes);

app.start('#root');
