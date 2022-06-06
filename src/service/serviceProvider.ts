import { SequelizeORM } from '../lib/sequelizeORM'
import { Models } from '../repository/model'
import { NoticeRepository } from '../repository/noticeRepository'
import { Repos, Services } from '../type'
import { ArticleService, CommentService, NotifyService } from '../service'
import { dbCfg } from '../config'

/************************************************************** */
// CAUTION : This is the example and equivalent to MVP.
// therefore, there is no managing connection pool and instance pool.
/************************************************************** */

const serviceProvider = async ()=>{
    const sequelize = await (new SequelizeORM()).initialize(dbCfg);
    const models = (new Models()).initialize(sequelize).associate();
    
    // TODO : the provider should be also one of the class.
    const buildRpoProvider = ():(()=>{})=>{
        const repositories:Repos = {}
        repositories.notice = new NoticeRepository(models);
        // TODO : The return should not be any, it can be modified multiple types or generic.
        return function getRepo():Repos{
            return repositories;
        }
    }
    const repoProvider = buildRpoProvider();

    // TODO : the provider should be also one of the class.
    const buildServiceProvider = ():(()=>{})=>{
        const services:Services = {}
        services.article = new ArticleService(repoProvider);
        services.comment = new CommentService(repoProvider);
        services.notify = new NotifyService(repoProvider);

        // TODO : The return should not be any, it can be modified multiple types or generic
        return function getService():Services{
            return services;
        }
    }
    const serviceProvider = buildServiceProvider()

    return serviceProvider;
}

export { serviceProvider }