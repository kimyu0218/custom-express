import catsRouter from 'src/router/cats.router';
import { Express, express } from './index';

const app: Express = express();

app.use('/cats', catsRouter);

app.listen(3000);
