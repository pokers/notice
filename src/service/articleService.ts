import { log } from '../lib/logger'
import { ArticleConnection, ArticleQuery, FirstLastItem, QueryInput, PageInfo, ArticleBody, ArticleParams, Repos } from '../type'
import { ServiceBase } from "./serviceBase";
import { ArticleModel, Order, ModelName, CursorName, Transaction } from '../repository/model'
import { 
    ErrorNotSupportedParameters,
    ErrorModuleNotFound, 
    ErrorInvalidBodyParameter,
    ErrorNotMatchedPasswd,
    ErrorItemNotFound
} from '../lib/error';

enum DefaultDate {
    PAST='2022-01-01 00:00:00',
    FUTURE='2999-01-01 00:00:00'
}

interface defaultRowInfo {
    createdAt: string
}

class ArticleService extends ServiceBase {
    constructor(repoProvoder: ()=>Repos){
        super(repoProvoder)
    }

    /***********************************************************************************
     * This method is for infinite scroll function, currently it's not necessary
     ***********************************************************************************/
    // private buildInfinitePageInfo<T extends defaultRowInfo>(firstLast: FirstLastItem<T>, items:T[], order:Order):PageInfo{
    //     try{
    //         const pageInfo:PageInfo = {
    //             startCursor: null,
    //             endCursor: null,
    //             hasNextPage: false,
    //             hasPrevPage: false
    //         }
    //         if(items.length <=0){
    //             return pageInfo;
    //         }

    //         const startItemOfListDate = new Date(items.length > 0 ? items[0].createdAt:DefaultDate.PAST).getTime();
    //         const endItemOfListDate = new Date(items.length > 0? items[items.length - 1].createdAt:DefaultDate.FUTURE).getTime();
    //         const firstItemDate = new Date(firstLast.first? firstLast.first.createdAt:DefaultDate.PAST).getTime();
    //         const lastItemDate = new Date(firstLast.last? firstLast.last.createdAt:DefaultDate.PAST).getTime();

    //         // log.info('list : ', startItemOfListDate, endItemOfListDate);
    //         // log.info('DB : ', firstItemDate, lastItemDate);

    //         pageInfo.startCursor = items.length > 0? items[0].createdAt:null;
    //         pageInfo.endCursor = items.length > 0? items[items.length - 1].createdAt:null;
    //         if(order === Order.ASC){
    //             pageInfo.hasNextPage = (lastItemDate > endItemOfListDate);
    //             pageInfo.hasPrevPage = (firstItemDate < startItemOfListDate);
    //         }else{
    //             pageInfo.hasNextPage = (firstItemDate < endItemOfListDate);
    //             pageInfo.hasPrevPage = (lastItemDate > startItemOfListDate);
    //         }

    //         return pageInfo;
    //     }catch(e){
    //         log.error('Exception > buildPageInfo : ', e);
    //         throw e;
    //     }
    // }


    /***********************************************************************************
     * This method is for infinite scroll function, currently it's not necessary
     ***********************************************************************************/
    // async getArticleList(query:ArticleQuery):Promise<ArticleConnection>{
    //     try{
    //         const result:ArticleConnection = {} as ArticleConnection;
    //         const { title, username, first, after, last, before } = query;
    //         if(first && last){
    //             throw ErrorNotSupportedParameters();
    //         }
    //         const noticeRepo = this.repoProvider().notice;
    //         if(noticeRepo === undefined){
    //             throw ErrorModuleNotFound();
    //         }

    //         // prepare input/query data
    //         const order = first? Order.ASC:Order.DESC;
    //         const queryInput:QueryInput = {};
    //         if(title) queryInput.title = title;
    //         if(username) queryInput.username = username;
    //         log.info('queryInput : ', queryInput, ' order : ', order)

    //         // get data
    //         const [firstLastItem, articleList] = await Promise.all([
    //             noticeRepo.getFirstLastItem<ArticleModel>(CursorName.createdAt, ModelName.article, queryInput),
    //             noticeRepo.getArticleList(queryInput, first, last, after, before)]);
    //         // log.info('FirstLast Item : ', firstLastItem);
    //         // log.info('Article List : ', articleList);

    //         // set result
    //         result.totalCount = articleList.length;
    //         result.edges = articleList.map((article:ArticleModel)=>({
    //             node: article,
    //             cursor: new Date(article.createdAt).toISOString()
    //         }));
    //         result.pageInfo = this.buildInfinitePageInfo<ArticleModel>(firstLastItem, articleList, order);

    //         return result;
    //     }catch(e){
    //         log.error('exception> getArticleList : ', e)
    //         throw e;
    //     }
    // }

    async getArticleListPage(query:ArticleQuery):Promise<ArticleConnection>{
        try{
            const result:ArticleConnection = {} as ArticleConnection;
            const { title, username, page, size } = query;
            const noticeRepo = this.repoProvider().notice;
            if(noticeRepo === undefined){
                throw ErrorModuleNotFound();
            }

            // prepare input/query data
            const queryInput:QueryInput = {};
            if(title) queryInput.title = title;
            if(username) queryInput.username = username;

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
            
            // log.info('query info : ', queryInput, offset, limit)

            // get data
            const [articleList] = await Promise.all([
                noticeRepo.getArticleListAndTotalCount(queryInput, offset, limit)]);
            // log.info('Article List : ', JSON.stringify(articleList));

            // set result
            result.totalCount = articleList.data.length;
            result.data = articleList.data;
            result.pageInfo = {
                pageSize: limit,
                currentPage: articleList.count > 0? currentPage:0,
                lastPage: articleList.count>0? Math.ceil(articleList.count / limit):0
            }

            return result;
        }catch(e){
            log.error('exception> getArticleList : ', e)
            throw e;
        }
    }

    async addArticle(body:ArticleBody):Promise<ArticleModel>{
        let transaction:Transaction | null = null;
        try{
            const { title, username, content, passwd} = body;
            const noticeRepo = this.repoProvider().notice;
            if(noticeRepo === undefined){
                throw ErrorModuleNotFound();
            }

            if(!(!!title && !!username && !!content && !!passwd)){
                throw ErrorInvalidBodyParameter();
            }

            // prepare insert data
            const queryInput:QueryInput = {title, username, content};
            queryInput.passwd = this.getHashString(passwd);
            log.info('insert info : ', queryInput)

            // get data
            transaction = await noticeRepo.startTransaction();
            const [result] = await Promise.all([
                noticeRepo.addArticle(queryInput, transaction)]);
            transaction.commit();
            log.info('add result : ', JSON.stringify(result));

            return result;
        }catch(e){
            transaction?.rollback();
            log.error('exception> addArticle : ', e)
            throw e;
        }
    }

    async updateArticle(params:ArticleParams, body:ArticleBody):Promise<number>{
        let transaction:Transaction | null = null;
        try{
            const resultCode:number = 201;
            const { id } = params;
            const { title, username, content, passwd} = body;
            const noticeRepo = this.repoProvider().notice;
            if(noticeRepo === undefined){
                throw ErrorModuleNotFound();
            }

            if(!(!!id) || !(!!passwd) || isNaN(parseInt(id))){
                throw ErrorInvalidBodyParameter();
            }
            
            const articleId:number = parseInt(id);
            // prepare insert data
            const queryInput:QueryInput = {title, username, content};
            log.info('update info : ', queryInput)

            // get data
            const article = await noticeRepo.getArticleById(articleId);
            if(article === null){
                throw ErrorItemNotFound();
            }

            log.info('original item : ', article);
            if(!this.comparePasswd(article.passwd, passwd)){
                throw ErrorNotMatchedPasswd();
            }
            transaction = await noticeRepo.startTransaction();
            const [result] = await Promise.all([
                noticeRepo.updateArticle(articleId, queryInput, transaction)]);
            transaction.commit();
            log.info('update result : ', result);

            return resultCode;
        }catch(e){
            transaction?.rollback();
            log.error('exception> updateArticle : ', e)
            throw e;
        }
    }

    async deleteArticle(params:ArticleParams, body:ArticleBody):Promise<number>{
        let transaction:Transaction | null = null;
        try{
            const resultCode:number = 200;
            const { id } = params;
            const { passwd } = body;
            const noticeRepo = this.repoProvider().notice;
            if(noticeRepo === undefined){
                throw ErrorModuleNotFound();
            }

            if(!(!!id) || !(!!passwd) || isNaN(parseInt(id))){
                log.info((!!id), ' , ', (!!passwd), ' , ', parseInt(id? id:'0'));
                throw ErrorInvalidBodyParameter();
            }
            
            const articleId:number = parseInt(id);

            // get data
            const article = await noticeRepo.getArticleById(articleId);
            if(article === null){
                throw ErrorItemNotFound();
            }
            log.info('original item : ', article);
            if(!this.comparePasswd(article.passwd, passwd)){
                throw ErrorNotMatchedPasswd();
            }
            transaction = await noticeRepo.startTransaction();
            const [result] = await Promise.all([
                noticeRepo.deleteArticle(articleId, transaction)]);
            transaction.commit();
            log.info('update result : ', result);

            return resultCode;
        }catch(e){
            transaction?.rollback();
            log.error('exception> addArticle : ', e)
            throw e;
        }
    }
}

export { ArticleService }