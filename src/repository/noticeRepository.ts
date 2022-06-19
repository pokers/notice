import { ArticleModel, Models, ModelName, CursorName, Order, CommentModel, Transaction, Op, WhereOptions, KeywordModel } from './model'
import { log } from '../lib/logger'
import { QueryInput} from '../type';
import { ErrorInvalidPageInfo, ErrorDuplicatedItem } from '../lib/error'


import { BaseError, DatabaseError, UniqueConstraintError } from 'sequelize'
class NoticeRepository {
    protected models: Models
    constructor(models: Models){
        this.models = models;
    }

    private isUniqueConstraintError(error:any){
        if(error instanceof UniqueConstraintError){
            const dupError:any = error.original;
            log.info('UniqueConstraintError : ', JSON.stringify(dupError.code));
            if(dupError.code && dupError.code === 'ER_DUP_ENTRY'){
                log.info('throw cError!')
                throw ErrorDuplicatedItem();
            }
        }

        throw error;
    }

    async getArticleList(query: QueryInput, first?:string, last?:string, after?:string, before?:string):Promise<ArticleModel[]>{
        try{
            const cursor: ArticleModel[CursorName.createdAt] = CursorName.createdAt;
            let where: WhereOptions = {};
            let limit: number = 50;
            let order:string = 'DESC';

            if(query){
                where = { ...where, ...query};
            }
            if(after){
                where = { ...where, createdAt: {[Op.gt]: after}};
            }
            if(before){
                where = { ...where, createdAt: {[Op.lt]: before}};
            }
            if(first){
                limit = parseInt(first);
                order = 'ASC';
            }
            if(last){
                limit = parseInt(last);
                order = 'DESC'
            }

            const articleModel = this.models.getModel(ModelName.article);
            const result:ArticleModel[] = await articleModel.findAll({where, limit, order:[[cursor, order]]});
            if(last){
                result.sort((a:ArticleModel, b:ArticleModel)=>{
                    const aDate = new Date(a.createdAt).getTime();
                    const bDate = new Date(b.createdAt).getTime();
                    return bDate - aDate;
                });
            }
            return result;
        }catch(e){
            log.error('exception> getArticleList : ', e);
            throw e;
        }
    }

    //  It's not necessary
    // async getFirstLastItem<T>(cursor: string, modelName:ModelName, query?: QueryInput):Promise<FirstLastItem<T>>{
    //     try{
    //         const result:FirstLastItem<T> = {} as FirstLastItem<T>
    //         let where: WhereOptions = {};
    //         if(query){
    //             where = {...where, ...query};
    //         }
    //         log.info('getFirstLastItem : ', query)
    //         const model = this.models.getModel(modelName);
    //         const [first, last] = await Promise.all([
    //             model.findOne({where,limit: 1,order: [[cursor, 'ASC']]}),
    //             model.findOne({where,limit: 1,order: [[cursor, 'DESC']]})
    //         ]);
    //         result.first = first;
    //         result.last = last;
    //         return result;
    //     }catch(e){
    //         log.error('exception> getArticleList : ', e);
    //         throw e;
    //     }
    // }

    async getArticleListAndTotalCount(query: QueryInput, offset: number, limit:number ):Promise<{data: ArticleModel[], count: number}>{
        try{
            let where: WhereOptions = {};
            if(offset < 0 || limit < 0){
                throw ErrorInvalidPageInfo();
            }
            if(query.title){
                where['title']= {
                    [Op.regexp]: query.title
                }
            }
            if(query.username){
                where['username'] = {
                    [Op.regexp]: query.username
                }
            }
            // log.info('where : ', where)

            const articleModel = this.models.getModel(ModelName.article);
            const result = await articleModel.findAndCountAll({
                where, 
                offset, 
                limit, 
                order:[[CursorName.createdAt, Order.DESC]]});
            // log.info('count : ', result.count, result.rows);

            return {data: result.rows, count: result.count};
        }catch(e){
            log.error('exception> getArticleList : ', e);
            throw e;
        }
    }

    async startTransaction():Promise<Transaction>{
        return await this.models.startTransaction();
    }
    async commit(transaction:Transaction){
        await transaction.commit();
    }
    async rollback(transaction:Transaction){
        await transaction.rollback();
    }

    async addArticle(query: QueryInput, transaction?: Transaction):Promise<ArticleModel>{
        try{
            log.info('insert info : ', query);
            const articleModel = this.models.getModel(ModelName.article);
            const result:ArticleModel = await articleModel.create(query, transaction);
            return result;
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception> addArticle : ', e);
            throw e;
        }
    }

    async getArticleById(articleId:number):Promise<ArticleModel|null>{
        try{
            let where: WhereOptions = {
                id:articleId
            };
            const articleModel = this.models.getModel(ModelName.article);
            const result:ArticleModel = await articleModel.findOne({
                where,
            });
            return result;
        }catch(e){
            log.error('exception> updateArticle : ', e);
            throw e;
        }
    }

    async updateArticle(articleId:number, query: QueryInput, transaction?: Transaction):Promise<ArticleModel|null>{
        try{
            log.info('insert info : ', query);
            const articleModel = this.models.getModel(ModelName.article);
            const result = await articleModel.update(
                query,{
                where: {id:articleId}
            }, transaction);
            return result;
        }catch(e){
            log.error('exception> updateArticle : ', e);
            throw e;
        }
    }

    async deleteArticle(articleId:number, transaction?:Transaction){
        try{
            const articleModel = this.models.getModel(ModelName.article);
            const result = await articleModel.destroy({where: {id:articleId}}, transaction);
            return result;
        }catch(e){
            log.error('exception> updateArticle : ', e);
            throw e;
        }
    }

    async getCommentListAndTotalCount(query: QueryInput, offset: number, limit:number ):Promise<{data: CommentModel[], count: number}>{
        try{
            if(offset < 0 || limit < 0){
                throw ErrorInvalidPageInfo();
            }
            let where: WhereOptions = {};
            if(query){
                where = { ...where, ...query};
            }
            // log.info('where : ', where)

            const commentModel = this.models.getModel(ModelName.comment);
            const result = await commentModel.findAndCountAll({
                where, 
                offset, 
                limit, 
                order:[[CursorName.createdAt, Order.DESC]],
                include: ['child']
            });
            // log.info('count : ', result.count, result.rows);

            return {data: result.rows, count: result.count};
        }catch(e){
            log.error('exception> getArticleList : ', e);
            throw e;
        }
    }

    async getCommentById(commentId:number):Promise<CommentModel|null>{
        try{
            let where: WhereOptions = {
                id:commentId
            };
            const commentModel = this.models.getModel(ModelName.comment);
            const result:CommentModel = await commentModel.findOne({
                where,
            });
            return result;
        }catch(e){
            log.error('exception> updateArticle : ', e);
            throw e;
        }
    }

    async addComment(query: QueryInput, transaction?: Transaction):Promise<CommentModel>{
        try{
            log.info('insert info : ', query);
            const commentModel = this.models.getModel(ModelName.comment);
            const result:CommentModel = await commentModel.create(query, transaction);
            log.info(result);
            return result;
        }catch(e){
            this.isUniqueConstraintError(e);
            log.error('exception> addComment : ', e);
            throw e;
        }
    }

    async getKeywordList():Promise<KeywordModel[]>{
        try{
            const commentModel = this.models.getModel(ModelName.keywork);
            const result = await commentModel.findAll({
                order:[[CursorName.username, Order.DESC]],
                raw: true
            });

            return result;
        }catch(e){
            log.error('exception> getArticleList : ', e);
            throw e;
        }
    }
}

export { NoticeRepository }