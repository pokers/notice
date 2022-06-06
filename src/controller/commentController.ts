import { log } from '../lib/logger';
import { Request, Response, NextFunction } from 'express';
import { cError } from '../lib/error'
import { STATUS_CODES } from 'http';
import { serviceProvider } from '../service/serviceProvider';
import { CommentModel } from '../repository/model';
import { Services, Connection} from '../type';

const getCommentList = async (req: Request, res:Response, next: NextFunction)=>{
    try{
        const provider:(()=>Services) = await serviceProvider();
        const service = await provider().comment;
        
        if(service === undefined){
            throw new cError(500, STATUS_CODES[500]);
        }
        const result:Connection<CommentModel> = await service.getCommentListPage(req.query);

        res.status(200).send({success: true, data: result});
        
    }catch(e){
        log.error('exception> getCommentList : ', e);
        next(e);
    }
}

const addComment = async (req: Request, res:Response, next: NextFunction)=>{
    try{
        const provider:(()=>Services) = await serviceProvider();
        const service = await provider().comment;

        if(service === undefined){
            throw new cError(500, STATUS_CODES[500]);
        }
        log.info('body : ', req.body);
        const result = await service.addComment(req.body);

        const notifyService = await provider().notify;
        /**
         * CAUTION & TODO : It's nonblocking and async. 
         * Usually The task of sending notification to users doesn't run on the same server instence due to large amount of keywords in the real field.
         * But it's just sample code so that run it without any Queue or infra services.
         */
        notifyService?.retrieveKeywork(req.body);
        
        res.status(201).send({success: true, data: result});
    }catch(e){
        log.error('exception> addComment : ', e);
        next(e);
    }
}

export { getCommentList, addComment }