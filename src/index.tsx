import '@/themes';
import App from '@/app';
import routes from '@/routes';
import models from '@/models';
import Action from '@/action';

const app = new App({});
app.setModels(models);

app.setRouter(routes);

app.start('#root');

new Action(app);
