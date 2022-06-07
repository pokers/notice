import { log } from '../lib/logger'
import { ServiceBase } from "./serviceBase";
import { CommentQuery, Connection, QueryInput, CommentBody, Repos } from '../type'
import { CommentModel, Transaction } from '../repository/model'
import { 
    ErrorModuleNotFound,
    ErrorInvalidBodyParameter,
    ErrorItemNotFound,
    ErrorNotMatchedArticle
 } from '../lib/error'

class CommentService extends ServiceBase{
    constructor(repoProvoder: ()=>Repos){
        super(repoProvoder);
    }

    async getCommentListPage(query:CommentQuery):Promise<Connection<CommentModel>>{
        try{
            const result:Connection<CommentModel> = {} as Connection<CommentModel>;
            const { username, articleId, page, size } = query;
            const noticeRepo = this.repoProvider().notice;
            if(noticeRepo === undefined){
                throw ErrorModuleNotFound();
            }

            // prepare input/query data
            const queryInput:QueryInput = {};
            if(username) queryInput.username = username;
            if(articleId && !isNaN(parseInt(articleId))) queryInput.articleId = parseInt(articleId);

            // extract page info
            let offset = 0, limit=50, currentPage = 1;
            if(size){
                limit = Math.max(1, parseInt(size));
                limit = isNaN(limit)? 50:limit;
            }
            if(page){
                currentPage = Math.max(1, parseInt(page));
                currentPage = isNaN(currentPage)? 1:currentPage;
                offset = (currentPage - 1) * limit;
            }
            
            log.info('query info : ', queryInput, offset, limit)

            // get data
            const [articleList] = await Promise.all([
                noticeRepo.getCommentListAndTotalCount(queryInput, offset, limit)]);
            log.info('Article List : ', JSON.stringify(articleList));

            // set result
            result.totalCount = articleList.data.length;
            result.data = articleList.data;
            result.pageInfo = {
                pageSize: limit,
                currentPage: articleList.count>0? currentPage:0,
                lastPage: articleList.count>0? Math.ceil(articleList.count / limit):0
            }

            return result;
        }catch(e){
            log.error('exception> getArticleList : ', e)
            throw e;
        }
    }


    async addComment(body:CommentBody):Promise<CommentModel>{
        let transaction:Transaction | null = null;
        try{
            const { articleId, parentId, username, content} = body;
            const noticeRepo = this.repoProvider().notice;
            if(noticeRepo === undefined){
                throw ErrorModuleNotFound();
            }

            if(!(!!articleId && !!username && !!content)){
                throw ErrorInvalidBodyParameter();
            }
            
            // prepare insert data            
            const queryInput:QueryInput = {
                articleId: parseInt(articleId),
                parentId: parentId? parseInt(parentId):null,
                username, 
                content
            };
            log.info('addComment> queryInput : ', queryInput);
            // get data
            const dataTasks = [];
            // const article = await noticeRepo.getArticleById(parseInt(articleId));
            // if(article === null){
            //     throw ErrorItemNotFound();
            // }
            // if(parentId){
            //     const comment = await noticeRepo.getCommentById(parseInt(parentId));
            //     if(comment === null){
            //         throw ErrorItemNotFound();
            //     }
            // }
            dataTasks.push(await noticeRepo.getArticleById(parseInt(articleId)));
            if(parentId){
                dataTasks.push(await noticeRepo.getCommentById(parseInt(parentId)));
            }
            const [article, comment] = await Promise.all(dataTasks);
            if(article === null){
                throw ErrorItemNotFound();
            }
            if(comment && article.id !== (comment as CommentModel).articleId){
                throw ErrorNotMatchedArticle();
            }
            
            transaction = await noticeRepo.startTransaction();
            const [result] = await Promise.all([
                noticeRepo.addComment(queryInput)]);
            transaction.commit();
            log.info('add result : ', JSON.stringify(result));

            return result;
        }catch(e){
            transaction?.rollback();
            log.error('exception> addArticle : ', e)
            throw e;
        }
    }
}

export { CommentService }