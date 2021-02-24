import '@/themes';
import App from '@/app';
import routes from '@/routes';
import models from '@/models';

const app = new App({});
app.setModels(models);

app.setRouter(routes);

app.start('#root');
