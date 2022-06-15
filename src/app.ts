import express, { Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import { serverCfg} from './config'
import { initRoutes } from './route'
import compression from 'compression'
import { log } from './lib/logger'

import { Services } from './type'
import { serviceProvider } from './service/serviceProvider'
import { SequelizeORM } from './lib/sequelizeORM'

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

process.on('SIGINT', async function() {
    console.log("Caught interrupt signal");
    const provider:(()=>Services) = await serviceProvider();
    await SequelizeORM.getInstance().close();
    // if(SequelizeORM.getInstance().isConnected()){
    //     await SequelizeORM.getInstance().close();
    // }
    process.exit(0);
});

export default app;
