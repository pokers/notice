import { log } from '../../lib/logger'
import { SequelizeORM, Transaction, Op, WhereOptions } from '../../lib/sequelizeORM';

// Models
import { 
    ArticleModel,
    CommentModel,
    KeywordModel
} from './'


enum ModelName {
    article='Article',
    comment='Comment',
    keywork='Keyword'
}

enum CursorName {
    createdAt ='createdAt',
    username = 'username'
}

enum Order {
    DESC='DESC',
    ASC='ASC'
}

class Models {
    private sequelize:SequelizeORM;
    private isInitialized:Boolean = false;
    private isAssociated:Boolean = false;
    private static instance:Models|null = null;

    public static getInstance(){
        if(this.instance === null){
            this.instance = new this();
        }

        return this.instance;
    }

    constructor(){
    }

    initialize(sequelize:SequelizeORM):Models{
        try{
            if(!this.isInitialized){
                this.isInitialized = true;
                this.sequelize = sequelize;
                ArticleModel.initialize(this.sequelize.getInstance());
                CommentModel.initialize(this.sequelize.getInstance());
                KeywordModel.initialize(this.sequelize.getInstance());
            }
            return this;
        }catch(e){
            log.error('exception> initialize :', e);
            throw e;
        }
    }

    associate():Models{
        try{
            if(!this.isAssociated){
                this.isAssociated = true;
                ArticleModel.hasMany(CommentModel, { foreignKey: 'articleId', as: 'comment', sourceKey: 'id'});
                CommentModel.belongsTo(ArticleModel, { foreignKey: 'articleId', targetKey: 'id'});
    
                CommentModel.hasMany(CommentModel, { foreignKey: 'parentId', as: 'child', sourceKey: 'id'});
                CommentModel.belongsTo(CommentModel, { foreignKey: 'parentId', as: 'parent', targetKey: 'id'})
            }
            return this;
        }catch(e){
            log.error('exception> associate : ', e);
            throw e;
        }
    }

    async startTransaction():Promise<Transaction>{
        return await this.sequelize.startTransaction();
    }
    async commit(transaction:Transaction){
        await transaction.commit();
    }
    async rollback(transaction:Transaction){
        await transaction.rollback();
    }

    getModel(name:ModelName):any{
        try{
            // TODO : it shoud be updated to match Upper case naming and low case table name.
            switch(name){
                case ModelName.article: return ArticleModel;
                case ModelName.comment: return CommentModel;
                case ModelName.keywork: return KeywordModel;
                default:
                    throw new Error('Unknown model name');
            }
        }catch(e){
            log.error('exception : ', e);
            throw e;
        }
    }
}


export { Models, ModelName, CursorName, Order, Transaction, Op, WhereOptions }