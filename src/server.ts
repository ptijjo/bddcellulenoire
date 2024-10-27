import { App } from '@/app';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { CategoryRoute } from './routes/categories.route';

ValidateEnv();

const app = new App([new UserRoute(), new CategoryRoute()]);

app.listen();
