import { log } from '../lib/logger'
import { ServiceBase } from "./serviceBase";
import { ArticleBody, CommentBody, Repos } from '../type'
import { KeywordModel, } from '../repository/model'
import { 
    ErrorItemNotFound
 } from '../lib/error'

class NotifyService extends ServiceBase{
    constructor(repoProvoder: ()=>Repos){
        super(repoProvoder);
    }

    async sendNotification(users:string[]){
        try{
            users.map(user=>{
                log.info('Send notification to :', user);
            });
        }catch(e){
            throw e;
        }
    }

    async retrieveKeywork(query:ArticleBody|CommentBody){
        try{
            const { content } = query;
            const noticeRepo = this.repoProvider().notice;
            if(noticeRepo === undefined){
                return;
            }
            if(!content){
                return;
            }

            // get data
            const keywordList:KeywordModel[] = await noticeRepo.getKeywordList();
            if(keywordList === null){
                throw ErrorItemNotFound();
            }

            // log.info('keyword list : ', keywordList)
            const userList:string[] = [];
            keywordList.map((keyword)=>{
                if(content.includes(keyword.keyword)){
                    userList.push(keyword.username);
                }
            });

            const distinctList:string[] = [...new Set(userList)];
            this.sendNotification(distinctList);
            return;
        }catch(e){
            log.error('exception> retrieveKeywork : ', e);
            // TODO : Send the administrator alarm message.
            return;
        }
    }
}

export { NotifyService }