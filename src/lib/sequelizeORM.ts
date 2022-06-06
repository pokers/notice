import { log } from './logger';
import { Sequelize, Transaction, Op, WhereOptions, Model, DataTypes } from 'sequelize'
import mysql2 from 'mysql2'
import { DbCfg } from '../type'

class SequelizeORM {
    private dbInst:Sequelize = {} as Sequelize;
    private _isConnected:Boolean = false;

    constructor(){
    }

    // It's not singleton
    getInstance():Sequelize{
        return this.dbInst;
    }

    isConnected():Boolean{
        return this._isConnected;
    }


    async startTransaction():Promise<Transaction>{
        return await this.dbInst.transaction();
    }
    async commit(transaction:Transaction){
        await transaction.commit();
    }
    async rollback(transaction:Transaction){
        await transaction.rollback();
    }


    async initialize(dbCfg: DbCfg): Promise<SequelizeORM>{
        try{
            // log.info('secret : ', this.secret);
            this.dbInst = new Sequelize({
                database: dbCfg.database,
                username: dbCfg.username,
                password: dbCfg.password,
                host: dbCfg.host,
                dialect: 'mysql',
                dialectModule: mysql2,
                define: {
                    timestamps: false
                },
                // timezone: "+09:00",
                logging: false,
                pool:{
                    max: 30,
                    min: 0,
                    idle: 10000,
                    acquire: 30000,
                }
            })
            await this.dbInst.authenticate();
            this._isConnected = true;
            return this;
        }catch(e){
            log.error("exception > ", e)
            throw e;
        }
    }
}

export { SequelizeORM, Transaction, Op, WhereOptions, Model, DataTypes, Sequelize };


