import express, { Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import { serverCfg} from './config'
import { initRoutes } from './route'
import compression from 'compression'
import { log } from './lib/logger'


// TODO : Need to update as capsulation all codes.

const app:Express = express();

app.set('port', serverCfg.port);

const corsOptions = {
    origin: '*',
};
app.use(cors(corsOptions));

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());

/************************************************************** */
// CAUTION : This is the example and equivalent to feasibility study to the market.
// therefore, there is no managing connection pool and instance pool.
// Also, would not use validator, would not use decorators, would not use defined statuCode, would not include strict unit/e2e test.
// Which means this project is not robust application!!
/************************************************************** */
initRoutes(app);
log.info('Route initialized...');

app.listen(serverCfg.port, () =>{
    log.info("Start server...\n")
});

export default app;


