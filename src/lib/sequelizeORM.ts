import { log } from './logger';
import { Sequelize, Transaction, Op, WhereOptions, Model, DataTypes } from 'sequelize'
import mysql2 from 'mysql2'
import { DbCfg } from '../type'

class SequelizeORM {
    private dbInst:Sequelize = {} as Sequelize;
    private _isConnected:Boolean = false;
    private static instance:SequelizeORM|null = null;

    public static getInstance(){
        if(this.instance === null){
            this.instance = new this();
        }

        return this.instance;
    }

    constructor(){
    }

    // It's not singleton
    getInstance():Sequelize{
        return this.dbInst;
    }

    isConnected():Boolean{
        return this._isConnected;
    }
    async close(){
        if(this._isConnected){
            this._isConnected = false;
            console.log('close connection');
            await this.dbInst.close();
        }
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
            if(!this._isConnected){
                this._isConnected = true;
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
                        max: 100,
                        min: 0,
                        idle: 10000,
                        acquire: 30000,
                    }
                });
                console.log('connection has beed established');
                await this.dbInst.authenticate();
            }
            return this;
        }catch(e){
            log.error("exception > ", e)
            throw e;
        }
    }
}

export { SequelizeORM, Transaction, Op, WhereOptions, Model, DataTypes, Sequelize };


