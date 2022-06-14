import { log } from '../lib/logger'
import { NextFunction, Request, Response} from 'express'
import { serviceProvider } from '../service/serviceProvider';
import { Services, ArticleConnection, ArticleQuery } from '../type'
import { cError } from '../lib/error'
import { STATUS_CODES } from 'http';
import { Debugger } from '../lib/debugger'

const getArticleList = async (req: Request, res:Response, next: NextFunction)=>{
    try{
        // For dev or debugging
        const dump = new Debugger();
        dump.collectHeapInfo();


        const provider:(()=>Services) = await serviceProvider();
        const service = await provider().article;
        
        if(service === undefined){
            throw new cError(500, STATUS_CODES[500]);
        }
        const result:ArticleConnection = await service.getArticleListPage(req.query);


        res.status(200).send({success: true, data: result});

        // For dev or debugging
        dump.collectHeapInfo();
    }catch(e){
        log.error('exception> add : ', e);
        next(e);
    }
}

const addArticle = async (req: Request, res:Response, next: NextFunction)=>{
    try{
        // For dev or debugging
        const dump = new Debugger();
        dump.collectHeapInfo();

        const provider:(()=>Services) = await serviceProvider();
        const articleService = await provider().article;

        if(articleService === undefined){
            throw new cError(500, STATUS_CODES[500]);
        }
        log.info('body : ', req.body);
        const result = await articleService.addArticle(req.body);

        const notifyService = await provider().notify;
        /**
         * CAUTION & TODO : It's nonblocking and async. 
         * Usually The task of sending notification to users doesn't run on the same server instence due to large amount of keywords in the real field.
         * But it's just sample code so that run it without any Queue or infra services.
         */
        notifyService?.retrieveKeywork(req.body);

        res.status(201).send({success: true, data: result});
        // For dev or debugging
        dump.collectHeapInfo();
    }catch(e){
        log.error('exception> add : ', e);
        next(e);
    }
}

const updateArticle = async (req: Request, res:Response, next: NextFunction)=>{
    try{
        // For dev or debugging
        const dump = new Debugger();
        dump.collectHeapInfo();

        const provider:(()=>Services) = await serviceProvider();
        const service = await provider().article;

        if(service === undefined){
            throw new cError(500, STATUS_CODES[500]);
        }
        log.info('body : ', req.body);
        const statusCode = await service.updateArticle(req.params, req.body);

        res.status(statusCode).send({success: true});

        // For dev or debugging
        dump.collectHeapInfo();
    }catch(e){
        log.error('exception> add : ', e);
        next(e);
    }
}

const deleteArticle = async (req: Request, res:Response, next: NextFunction)=>{
    try{
        // For dev or debugging
        const dump = new Debugger();
        dump.collectHeapInfo();

        const provider:(()=>Services) = await serviceProvider();
        const service = await provider().article;

        if(service === undefined){
            throw new cError(500, STATUS_CODES[500]);
        }
        log.info('body : ', req.body);
        /**
         * CAUTION & TODO: Usually DELETE doesn't have body parameter, 
         * but here, because there is no authentication method, it would allow to have body parameter.
         */
        const statusCode = await service.deleteArticle(req.params, req.body);

        res.status(statusCode).send({success: true});

        // For dev or debugging
        dump.collectHeapInfo();
    }catch(e){
        log.error('exception> deleteArticle : ', e);
        next(e);
    }
}

export { getArticleList,
    addArticle,
    updateArticle,
    deleteArticle
}