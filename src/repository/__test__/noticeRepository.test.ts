import { NoticeRepository } from "../noticeRepository";
import { Models, ModelName, ArticleModel, CommentModel, Order, Op } from '../model'
import { cError, ErrMessage } from '../../lib/error'

jest.mock('../model');
const dummyData = {
    data: [{
        id:0,
        title: 'success', 
        content: 'dummy content1',
        username: 'username1',
        passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
        createdAt: '2022-06-05 10:00:00',
        updatedAt: '2022-06-05 10:00:00'
    } as ArticleModel,
    {
        id:1,
        title: 'fail', 
        content: 'dummy content2',
        username: 'username2',
        passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
        createdAt: '2022-06-05 10:10:00',
        updatedAt: '2022-06-05 10:10:00'
    } as ArticleModel,
    {
        id:2,
        title: 'success2', 
        content: 'dummy content3',
        username: 'username3',
        passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
        createdAt: '2022-06-05 10:20:00',
        updatedAt: '2022-06-05 10:20:00'
    } as ArticleModel,
    {
        id:3,
        title: 'fail2', 
        content: 'dummy content4',
        username: 'username1',
        passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
        createdAt: '2022-06-05 10:30:00',
        updatedAt: '2022-06-05 10:30:00'
    } as ArticleModel],
    count: 4
}


const dummyCommentData = {
    data: [{
        id:0,
        articleId: 0,
        parentId: null,
        content: 'dummy content',
        username: 'username1',
        createdAt: 'dummy date',
    } as CommentModel,
    {
        id:1,
        articleId: 1,
        parentId: 0,
        content: 'dummy content',
        username: 'username1',
        createdAt: 'dummy date',
    } as CommentModel,
    {
        id:2,
        articleId: 2,
        parentId: 0,
        content: 'dummy content',
        username: 'username2',
        createdAt: 'dummy date',
    } as CommentModel,
    {
        id:3,
        articleId: 2,
        parentId: null,
        content: 'dummy content',
        username: 'username2',
        createdAt: 'dummy date',
    } as CommentModel],
    count: 4
}

const models = jest.fn().mockImplementation((name)=>{
    if(name === ModelName.article){
        return {
            findAll: async (queryOption:any):Promise<ArticleModel[]>=>{
                console.log('Query : ', queryOption);

                const {where, limit, order} = queryOption;
                let result = JSON.parse(JSON.stringify(dummyData.data));
                if(!where){

                }
                if(where && where.title){
                    result = dummyData.data.filter((item:ArticleModel)=>item.title === where.title);
                }
                if(where && where.username){
                    result = result.filter((item:ArticleModel)=>item.username === where.username);
                }
                if(where && where.id){
                    result = result.filter((item:ArticleModel)=>item.id === where.id);
                }
                if(order){
                    const orderString = order[0][1];
                    if(orderString === Order.DESC){
                        result.sort((a:ArticleModel, b:ArticleModel)=>{
                            const aDate = new Date(a.createdAt).getTime();
                            const bDate = new Date(b.createdAt).getTime();
                            return aDate - bDate;
                        });
                    }
                }
                if(limit){
                    result = result.slice(0, limit);
                }
                // console.log(result);
                return result;
            },
            findAndCountAll: async (queryOption:any):Promise<{rows: ArticleModel[], count: number}>=>{
                // console.log('Query : ', queryOption);

                const {where, offset, limit, order} = queryOption;
                let result = JSON.parse(JSON.stringify(dummyData.data));
                
                if(where && where.title){
                    result = dummyData.data.filter((item:ArticleModel)=>item.title === where.title[Op.regexp]);
                }
                if(where && where.username){
                    result = result.filter((item:ArticleModel)=>item.username === where.username[Op.regexp]);
                }
                if(where && where.id){
                    result = result.filter((item:ArticleModel)=>item.id === where.id);
                }
                if(order){
                    const orderString = order[0][1];
                    if(orderString === Order.DESC){
                        result.sort((a:ArticleModel, b:ArticleModel)=>{
                            const aDate = new Date(a.createdAt).getTime();
                            const bDate = new Date(b.createdAt).getTime();
                            return aDate - bDate;
                        });
                    }
                }
                if(limit && offset){
                    result = result.slice(offset, offset+limit);
                }else if(limit){
                    result = result.slice(0, limit);
                }else if(offset){
                    result = result.slice(offset);
                }
                // console.log(result);
                return {rows: result, count: result.length};
            },
            create: async (queryOption: any):Promise<ArticleModel>=>{
                const {title, username, content, passwd} = queryOption;
                
                return {
                    id: 0,
                    title: title,
                    username: username,
                    content: content,
                    passwd: passwd,
                    createdAt: '2022-06-05 22:00:00',
                    updatedAt: '2022-06-05 22:00:00'
                } as ArticleModel;
            },
            findOne: async (queryOption: any):Promise<ArticleModel|null>=>{
                const {where} = queryOption;
                let result = JSON.parse(JSON.stringify(dummyData.data));
                if(where && where.id){
                    let found = result.find((item:ArticleModel)=>item.id === where.id);
                    if(found){
                        return found;
                    }
                }

                return null;
            },
            update: async (query:any, queryOption: any):Promise<ArticleModel|null>=>{
                const {where} = queryOption;
                // console.log('update query option : ', query, where);
                let result = JSON.parse(JSON.stringify(dummyData.data));
                if(where && where.id){
                    let found = result.find((item:ArticleModel)=>item.id === where.id);
                    if(found){
                        if(query.content){
                            found.content = query.content;
                        }
                        if(query.title){
                            found.title = query.title;
                        }
                        return found;
                    }
                }
                return null;
            },
            destroy: async (queryOption: any):Promise<number>=>{
                const {where} = queryOption;
                // console.log('destory query option : ', where);
                let result = JSON.parse(JSON.stringify(dummyData.data));
                if(where && where.id){
                    let found = result.filter((item:ArticleModel)=>item.id === where.id);
                    if(found){
                        return found.length;
                    }
                }
                return 0;
            }
        }
    }
    if(name === ModelName.comment){
        return {
            findAndCountAll: async (queryOption:any):Promise<{rows: CommentModel[], count: number}>=>{
                // console.log('Query : ', queryOption);

                const {where, offset, limit, order} = queryOption;
                let result = JSON.parse(JSON.stringify(dummyCommentData.data));
                
                if(where && where.username){
                    result = result.filter((item:CommentModel)=>item.username === where.username);
                }
                if(where && where.id){
                    result = result.filter((item:CommentModel)=>item.id === where.id);
                }
                if(order){
                    const orderString = order[0][1];
                    if(orderString === Order.DESC){
                        result.sort((a:CommentModel, b:CommentModel)=>{
                            const aDate = new Date(a.createdAt).getTime();
                            const bDate = new Date(b.createdAt).getTime();
                            return aDate - bDate;
                        });
                    }
                }
                if(limit && offset){
                    result = result.slice(offset, offset+limit);
                }else if(limit){
                    result = result.slice(0, limit);
                }else if(offset){
                    result = result.slice(offset);
                }
                // console.log(result);
                return {rows: result, count: result.length};
            },
            create: async (queryOption: any):Promise<CommentModel>=>{
                const {username, content} = queryOption;
                return {
                    id: 0,
                    username: username,
                    content: content,
                    createdAt: '2022-06-05 22:00:00',
                } as CommentModel;
            },
        }
    }
});
Models.prototype.getModel = models;

describe('Unit test : NoticeRepository ', ()=>{
    /******************************************************************
     * TEST FUNCTION : constructor
     ******************************************************************/
    test('Instance Initialize - succeed to create instance', async ()=>{
        const models = new Models();
        const inst = new NoticeRepository(models);
        expect(inst).toBeTruthy();
        expect(inst).toBeInstanceOf(NoticeRepository);
    });

    /******************************************************************
     * TEST FUNCTION : getArticleList
     ******************************************************************/
    test('getArticleList - No filter parameter, get all data', async ()=>{
        let exception = null;
        try{
            const expectedResult = [{
                id: 0,
                title: 'success',
                content: 'dummy content1',
                username: 'username1',
                passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                createdAt: '2022-06-05 10:00:00',
                updatedAt: '2022-06-05 10:00:00'
            } as ArticleModel,{
                id: 1,
                title: 'fail',
                content: 'dummy content2',
                username: 'username2',
                passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                createdAt: '2022-06-05 10:10:00',
                updatedAt: '2022-06-05 10:10:00'
            } as ArticleModel,{
                id: 2,
                title: 'success2',
                content: 'dummy content3',
                username: 'username3',
                passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                createdAt: '2022-06-05 10:20:00',
                updatedAt: '2022-06-05 10:20:00'
            } as ArticleModel,{
                id: 3,
                title: 'fail2',
                content: 'dummy content4',
                username: 'username1',
                passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                createdAt: '2022-06-05 10:30:00',
                updatedAt: '2022-06-05 10:30:00'
            } as ArticleModel];
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getArticleList({});
            // console.log('result : ', result);
            // console.log('expected result : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('getArticleList - title filter', async ()=>{
        let exception = null;
        try{
            const expectedResult = [{
                id: 0,
                title: 'success',
                content: 'dummy content1',
                username: 'username1',
                passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                createdAt: '2022-06-05 10:00:00',
                updatedAt: '2022-06-05 10:00:00'
            }];
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getArticleList({title: 'success'});
            // console.log('result : ', result);
            // console.log('expected result : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('getArticleList - username filter', async ()=>{
        let exception = null;
        try{
            const expectedResult = [{
                id: 0,
                title: 'success',
                content: 'dummy content1',
                username: 'username1',
                passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                createdAt: '2022-06-05 10:00:00',
                updatedAt: '2022-06-05 10:00:00'
            },{
                id: 3,
                title: 'fail2',
                content: 'dummy content4',
                username: 'username1',
                passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                createdAt: '2022-06-05 10:30:00',
                updatedAt: '2022-06-05 10:30:00'
            }];
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getArticleList({username: 'username1'});
            // console.log('result : ', result);
            // console.log('expected result : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('getArticleList - limit filter', async ()=>{
        let exception = null;
        try{
            const expectedResult = [{
                id: 0,
                title: 'success',
                content: 'dummy content1',
                username: 'username1',
                passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                createdAt: '2022-06-05 10:00:00',
                updatedAt: '2022-06-05 10:00:00'
            },{
                id: 3,
                title: 'fail2',
                content: 'dummy content4',
                username: 'username1',
                passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                createdAt: '2022-06-05 10:30:00',
                updatedAt: '2022-06-05 10:30:00'
            }];
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getArticleList({username: 'username1'});
            // console.log('result : ', result);
            // console.log('expected result : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    /******************************************************************
     * TEST FUNCTION : getArticleListAndTotalCount
     ******************************************************************/
     test('getArticleListAndTotalCount - Invalid Parameter', async ()=>{
        const models = new Models();
        const inst = new NoticeRepository(models);
        inst.getArticleListAndTotalCount({}, -1, -1).then(result=>expect(result).toThrow(ErrMessage.ErrorInvalidPageInfo));
    });

    test('getArticleListAndTotalCount - offset/limit 0,1 Parameter', async ()=>{
        let exception = null;
        try{
            const expectedResult = {
                data: [{
                    id: 0,
                    title: 'success',
                    content: 'dummy content1',
                    username: 'username1',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: '2022-06-05 10:00:00',
                    updatedAt: '2022-06-05 10:00:00'
                }],
                count: 1
            };
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getArticleListAndTotalCount({}, 0, 1);
            // console.log('result : ', result);
            // console.log('expected result : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);

        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('getArticleListAndTotalCount - offset/limit 1,2 Parameter', async ()=>{
        let exception = null;
        try{
            const expectedResult = {
                data: [{
                    id: 1,
                    title: 'fail',
                    content: 'dummy content2',
                    username: 'username2',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: '2022-06-05 10:10:00',
                    updatedAt: '2022-06-05 10:10:00'
                },{
                    id: 2,
                    title: 'success2',
                    content: 'dummy content3',
                    username: 'username3',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: '2022-06-05 10:20:00',
                    updatedAt: '2022-06-05 10:20:00'
                }],
                count: 2
            };
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getArticleListAndTotalCount({}, 1, 2);
            // console.log('result : ', result);
            // console.log('expected result : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);

        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('getArticleListAndTotalCount - title Parameter', async ()=>{
        let exception = null;
        try{
            const expectedResult = {
                data: [{
                    id: 0,
                    title: 'success',
                    content: 'dummy content1',
                    username: 'username1',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: '2022-06-05 10:00:00',
                    updatedAt: '2022-06-05 10:00:00'
                }],
                count: 1
            }
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getArticleListAndTotalCount({title: 'success'}, 0, 2);
            // console.log('result : ', result);
            // console.log('expected result : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);

        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('getArticleListAndTotalCount - username Parameter', async ()=>{
        let exception = null;
        try{
            const expectedResult = {
                data: [{
                    id: 0,
                    title: 'success',
                    content: 'dummy content1',
                    username: 'username1',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: '2022-06-05 10:00:00',
                    updatedAt: '2022-06-05 10:00:00'
                },{
                    id: 3,
                    title: 'fail2',
                    content: 'dummy content4',
                    username: 'username1',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: '2022-06-05 10:30:00',
                    updatedAt: '2022-06-05 10:30:00'
                }],
                count: 2
            }
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getArticleListAndTotalCount({username: 'username1'}, 0, 50);
            // console.log('result : ', result);
            // console.log('expected result : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);

        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('getArticleListAndTotalCount - title and username Parameter, It shoud return empty result', async ()=>{
        let exception = null;
        try{
            const expectedResult = { data: [], count: 0 };
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getArticleListAndTotalCount({username: 'username1', title:'seo'}, 0, 50);
            // console.log('result : ', result);
            // console.log('expected result : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
            expect(result.data).toHaveLength(0);
            expect(result.count).toBe(0);
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    /******************************************************************
     * TEST FUNCTION : addArticle
     ******************************************************************/
    test('addArticle - empty query parameter', async ()=>{
        let exception = null;
        try{
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.addArticle({});
            // console.log('result : ', result);
            expect(result.title).toBeUndefined();
            expect(result.username).toBeUndefined();
            expect(result.content).toBeUndefined();
            expect(result.passwd).toBeUndefined();
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('addArticle - Inpute title, username, passwd parameter only', async ()=>{
        let exception = null;
        try{
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.addArticle({title: 'title', username:'username', passwd: 'passwd'});
            // console.log('result : ', result);
            expect(result.title).toBe('title');
            expect(result.username).toBe('username');
            expect(result.content).toBeUndefined()
            expect(result.passwd).toBe('passwd');
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    /******************************************************************
     * TEST FUNCTION : getArticleById
     ******************************************************************/
    test('getArticleById - Invalid ID.(Out of range)', async ()=>{
        let exception = null;
        try{
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getArticleById(100);
            // console.log('result : ', result);
            expect(result).toBeNull();
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('getArticleById - Valid ID.', async ()=>{
        let exception = null;
        try{
            const expectedResult = {
                id: 1,
                title: 'fail',
                content: 'dummy content2',
                username: 'username2',
                passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                createdAt: '2022-06-05 10:10:00',
                updatedAt: '2022-06-05 10:10:00'
            }
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getArticleById(1);
            // console.log(result);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    /******************************************************************
     * TEST FUNCTION : updateArticle
    ******************************************************************/
    test('updateArticle - Invalid ID.(Out of range)', async ()=>{
        let exception = null;
        try{
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.updateArticle(100, {});
            // console.log('result : ', result);
            expect(result).toBeNull();
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('updateArticle - Valid ID.', async ()=>{
        let exception = null;
        try{
            const expectedResult = {
                id: 1,
                title: 'fail',
                content: 'updated content',
                username: 'username2',
                passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                createdAt: '2022-06-05 10:10:00',
                updatedAt: '2022-06-05 10:10:00'
            }
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.updateArticle(1, {content:'updated content'});
            // console.log('result : ', result);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    /******************************************************************
     * TEST FUNCTION : deleteArticle
    ******************************************************************/
     test('deleteArticle - Invalid ID.(Out of range)', async ()=>{
        let exception = null;
        try{
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.deleteArticle(100);
            // console.log('result : ', result);
            expect(result).toBe(0);
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('deleteArticle - Valid ID.', async ()=>{
        let exception = null;
        try{
            const expectedResult = {
                id: 1,
                title: 'fail',
                content: 'updated content',
                username: 'username2',
                passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                createdAt: '2022-06-05 10:10:00',
                updatedAt: '2022-06-05 10:10:00'
            }
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.deleteArticle(1);
            // console.log(result);
            expect(result).toBe(1);
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });















    /******************************************************************
     * TEST FUNCTION : getCommentListAndTotalCount
     ******************************************************************/
     test('getCommentListAndTotalCount - Invalid Parameter', async ()=>{
        const models = new Models();
        const inst = new NoticeRepository(models);
        inst.getCommentListAndTotalCount({}, -1, -1).then(result=>expect(result).toThrow(ErrMessage.ErrorInvalidPageInfo));
    });

    test('getCommentListAndTotalCount - offset/limit 0,1 Parameter', async ()=>{
        let exception = null;
        try{
            const expectedResult = {
                data: [{
                    id: 0,
                    articleId: 0,
                    parentId: null,
                    content: 'dummy content',
                    username: 'username1',
                    createdAt: 'dummy date'
                }],
                count: 1
            }
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getCommentListAndTotalCount({}, 0, 1);
            // console.log('result : ', result);
            // console.log('expected result : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);

        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('getCommentListAndTotalCount - offset/limit 1,2 Parameter', async ()=>{
        let exception = null;
        try{
            const expectedResult = {
                data: [{
                    id: 1,
                    articleId: 1,
                    parentId: 0,
                    content: 'dummy content',
                    username: 'username1',
                    createdAt: 'dummy date'
                },{
                    id: 2,
                    articleId: 2,
                    parentId: 0,
                    content: 'dummy content',
                    username: 'username2',
                    createdAt: 'dummy date'
                }],
                count: 2
            }
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getCommentListAndTotalCount({}, 1, 2);
            // console.log('result : ', result);
            // console.log('expected result : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);

        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('getCommentListAndTotalCount - title Parameter', async ()=>{
        let exception = null;
        try{
            const expectedResult = {
                data: [{
                    id: 0,
                    articleId: 0,
                    parentId: null,
                    content: 'dummy content',
                    username: 'username1',
                    createdAt: 'dummy date'
                },{
                    id: 1,
                    articleId: 1,
                    parentId: 0,
                    content: 'dummy content',
                    username: 'username1',
                    createdAt: 'dummy date'
                }],
                count: 2
            }
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getCommentListAndTotalCount({title: 'success'}, 0, 2);
            // console.log('result : ', result);
            // console.log('expected result : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);

        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('getCommentListAndTotalCount - username Parameter', async ()=>{
        let exception = null;
        try{
            const expectedResult = {
                data: [{
                    id: 0,
                    articleId: 0,
                    parentId: null,
                    content: 'dummy content',
                    username: 'username1',
                    createdAt: 'dummy date'
                },{
                    id: 1,
                    articleId: 1,
                    parentId: 0,
                    content: 'dummy content',
                    username: 'username1',
                    createdAt: 'dummy date'
                }],
                count: 2
            }
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getCommentListAndTotalCount({username: 'username1'}, 0, 50);
            // console.log('result : ', result);
            // console.log('expected result : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);

        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('getCommentListAndTotalCount - username Parameter, It shoud return empty result', async ()=>{
        let exception = null;
        try{
            const expectedResult = { data: [], count: 0 };
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.getCommentListAndTotalCount({username: 'seo', content:'seo'}, 0, 50);
            // console.log('result : ', result);
            // console.log('expected result : ', expectedResult);
            // expect(result).toStrictEqual(expectedResult);
            expect(result.data).toHaveLength(0);
            expect(result.count).toBe(0);
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });

    /******************************************************************
     * TEST FUNCTION : addComment
     ******************************************************************/
    test('addComment - empty query parameter', async ()=>{
        let exception = null;
        try{
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.addComment({});
            // console.log('result : ', result);
            expect(result.username).toBeUndefined();
            expect(result.content).toBeUndefined();
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('addComment - Inpute username, passwd parameter only', async ()=>{
        let exception = null;
        try{
            const models = new Models();
            const inst = new NoticeRepository(models);
            const result = await inst.addComment({content: 'title', username:'username'});
            // console.log('result : ', result);
            expect(result.username).toBe('username');
            expect(result.content).toBe('title');
            expect(result.createdAt).toBeTruthy();
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }

        expect(exception).toBeNull();
    });
});

