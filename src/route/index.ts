import { Express, NextFunction, Request, Response } from 'express'
import { v1 } from './v1'
import { cError } from '../lib/error'
import { log } from '../lib/logger'

export const ErrorHandler = (error: cError, req:Request, res: Response, next: NextFunction)=>{
    if(error instanceof cError){
        log.error('statusCode : ', error.getStatusCode());
        return res.status(error.getStatusCode()).json({message: error.message});
    }
    log.error(error);
    res.status(500).send({message:'Internal Server Error'});
}

const initRoutes = (app:Express)=>{
    app.use('/api/v1', v1());
    app.use(ErrorHandler);
}
export { initRoutes }