import { ArticleService } from "../articleService";
import { Repos, QueryInput, ArticleConnection, ArticleBody, ArticleParams } from '../../type'
import { cError } from '../../lib/error'
import { NoticeRepository } from '../../repository'
import { ArticleModel } from '../../repository/model'

const emptyRepoProvider = ():Repos=>{
    // console.log('emptyRepoProvider : ');
    return {};
}

const dummyRepoProvider = ():Repos=>{
    // console.log('dummyRepoProvider : ');
    const repositories:Repos = {}
    repositories.notice = {
        getArticleListAndTotalCount: async (query: QueryInput, offset: number, limit:number ):Promise<{data: ArticleModel[], count: number}>=>{
            // console.log('called getArticleListAndTotalCount');
            return {data: [], count: 0};
        }
    } as NoticeRepository
    return repositories;
}

// Dummy data
const dummyData = {
    data: [{
        id:0,
        title: 'success', 
        content: 'dummy content',
        username: 'username1',
        passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
        createdAt: 'dummy date',
        updatedAt: 'dummy date'
    } as ArticleModel,
    {
        id:1,
        title: 'fail', 
        content: 'dummy content',
        username: 'username2',
        passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
        createdAt: 'dummy date',
        updatedAt: 'dummy date'
    } as ArticleModel,
    {
        id:2,
        title: 'success2', 
        content: 'dummy content',
        username: 'username3',
        passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
        createdAt: 'dummy date',
        updatedAt: 'dummy date'
    } as ArticleModel,
    {
        id:3,
        title: 'fail2', 
        content: 'dummy content',
        username: 'username1',
        passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
        createdAt: 'dummy date',
        updatedAt: 'dummy date'
    } as ArticleModel],
    count: 4
}

// Mocking Object
const mockRepoProvider = ():Repos=>{
    const repositories:Repos = {}
    repositories.notice = {
        getArticleListAndTotalCount: async (query: QueryInput, offset: number, limit:number ):Promise<{data: ArticleModel[], count: number}>=>{
            const {title, username } = query;
            // console.log('Mocked function > getArticleListAndTotalCount - input params : ', query, offset, limit);
            const result = JSON.parse(JSON.stringify(dummyData));

            if(username){
                result.data = dummyData.data.filter(item=>{
                    return item.username === username;
                })
                result.count = result.data.length;
            }
            if(title){
                result.data = dummyData.data.filter(item=>{
                    return item.title === title;
                })
                result.count = result.data.length;
            }
            if(username && title){
                result.data = dummyData.data.filter(item=>{
                    return item.title === title && item.username === username;
                })
                result.count = result.data.length;
            }
            if(offset){
                result.data = result.data.slice(offset);
            }
            if(limit){
                result.data = result.data.slice(0, limit);
            }
            if(offset && limit){
                result.data = result.data.slice(offset, offset+limit);
            }
            return result;
        },
        startTransaction: async ()=>{
            // console.log('called startTransaction');
            return {
                commit: ()=>{ return {}},
                rollback: ()=>{ return {}}
            }
        },
        addArticle: async (query: QueryInput):Promise<ArticleModel>=>{
            const { title, username, content, passwd } = query;
            if(title && username && content && passwd){
                return {
                    id: 1,
                    title: title,
                    content: content,
                    username: username,
                    passwd: '',
                    createdAt: '2022-06-05 00:00:00',
                    updatedAt: '2022-06-05 00:00:00',
                } as ArticleModel;
            }
            throw new Error('Exception addArticle');
        },
        getArticleById: async (articleId:number):Promise<ArticleModel|null>=>{
             const index = dummyData.data.findIndex(item=>item.id===articleId);
             if(index >= 0){
                 return dummyData.data[index];
             }

            return null;
        },
        updateArticle: async (articleId:number, query: QueryInput):Promise<ArticleModel|null>=>{
            const index = dummyData.data.findIndex(item=>item.id===articleId);
             if(index >= 0){
                 if(query.title){
                    dummyData.data[index].title = query.title;
                 }
                 if(query.content){
                    dummyData.data[index].content = query.content;
                 }
                 
             }

            return null;
        }
    } as NoticeRepository
    return repositories;
}


describe('Unit Test articleService', ()=>{

    /******************************************************************
     * TEST FUNCTION : constructor
     ******************************************************************/
    test('Instance Initialize - succeed to create instance', async ()=>{
        const inst = new ArticleService(dummyRepoProvider);
        expect(inst).toBeTruthy();
        expect(inst).toBeInstanceOf(ArticleService);
    });

    /******************************************************************
     * TEST FUNCTION : getArticleListPage
     ******************************************************************/
    test('getArticleListPage - Invalid repo, it should throw exception', async ()=>{
        let exception = null;
        try{
            const inst = new ArticleService(emptyRepoProvider);
            await inst.getArticleListPage({});
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }
        expect(exception).not.toBeNull();
    });

    test('getArticleListPage - Invalid repo, it should throw cError exception', async ()=>{
        const inst = new ArticleService(emptyRepoProvider);
        inst.getArticleListPage({}).then(result=>expect(result).toThrow(cError));
    });

    test('getArticleListPage - valid repo, it would not throw exception but do not care result', async ()=>{
        let exception = null;
        try{
            const inst = new ArticleService(dummyRepoProvider);
            await inst.getArticleListPage({});
        }catch(e){
            // console.log('exception : ', e);
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('getArticleListPage - Test result : it would return default Connection object', async ()=>{
        let exception = null;
        try{
            const expectedResult:ArticleConnection = {
                totalCount: 0,
                data: [],
                pageInfo: { pageSize: 50, currentPage: 0, lastPage: 0 }
            }
            const inst = new ArticleService(dummyRepoProvider);
            const result = await inst.getArticleListPage({});
            // console.log(result);
            expect(result).toStrictEqual(expectedResult);
            return;
        }catch(e){
            // console.log('exception : ', e);
            exception = e;
        }

        expect(exception).toBeNull();
    });

    test('getArticleListPage - Input parameter : the result should be All dummy data ', async ()=>{
        let exception = null;
        try{
            // Expected result
            const expectedResult = {
                totalCount: 4,
                data: [
                    {
                        id: 0,
                        title: 'success',
                        content: 'dummy content',
                        username: 'username1',
                        passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                        createdAt: 'dummy date',
                        updatedAt: 'dummy date'
                    },
                    {
                        id: 1,
                        title: 'fail',
                        content: 'dummy content',
                        username: 'username2',
                        passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                        createdAt: 'dummy date',
                        updatedAt: 'dummy date'
                    },
                    {
                        id: 2,
                        title: 'success2',
                        content: 'dummy content',
                        username: 'username3',
                        passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                        createdAt: 'dummy date',
                        updatedAt: 'dummy date'
                    },
                    {
                        id: 3,
                        title: 'fail2',
                        content: 'dummy content',
                        username: 'username1',
                        passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                        createdAt: 'dummy date',
                        updatedAt: 'dummy date'
                    }
                ],
                    pageInfo: { pageSize: 50, currentPage: 1, lastPage: 1 }
            }

            // Test procedure
            const inst = new ArticleService(mockRepoProvider);
            const result = await inst.getArticleListPage({});
            // console.log('1 result : ', result);
            // console.log('1 dummy : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('getArticleListPage - Input parameter : title filter test', async ()=>{
        let exception = null;
        try{
            // Expected result
            const expectedResult = {
                totalCount: 1,
                data: [
                    {
                    id: 0,
                    title: 'success',
                    content: 'dummy content',
                    username: 'username1',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: 'dummy date',
                    updatedAt: 'dummy date'
                    }
                ],
                pageInfo: { pageSize: 50, currentPage: 1, lastPage: 1 }
            }

            // Test procedure
            const inst = new ArticleService(mockRepoProvider);
            const result = await inst.getArticleListPage({title: 'success'});
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('getArticleListPage - Input parameter : username filter test', async ()=>{
        let exception = null;
        try{
            // Expected result
            const expectedResult = {
                totalCount: 2,
                data: [{
                    id: 0,
                    title: 'success',
                    content: 'dummy content',
                    username: 'username1',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: 'dummy date',
                    updatedAt: 'dummy date'
                },{
                    id: 3,
                    title: 'fail2',
                    content: 'dummy content',
                    username: 'username1',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: 'dummy date',
                    updatedAt: 'dummy date'
                }],
                pageInfo: { pageSize: 50, currentPage: 1, lastPage: 1 }
            }
            // Test procedure
            const inst = new ArticleService(mockRepoProvider);
            const result = await inst.getArticleListPage({username: 'username1'});
            // console.log('result : ', result);
            // console.log('expectedResult : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('getArticleListPage - Input parameter : title and username filter test', async ()=>{
        let exception = null;
        try{
            // Expected result
            const expectedResult = {
                totalCount: 1,
                data: [{
                    id: 0,
                    title: 'success',
                    content: 'dummy content',
                    username: 'username1',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: 'dummy date',
                    updatedAt: 'dummy date'
                }],
                pageInfo: { pageSize: 50, currentPage: 1, lastPage: 1 }
            }
            // Test procedure
            const inst = new ArticleService(mockRepoProvider);
            const result = await inst.getArticleListPage({title: 'success', username: 'username1'});
            // console.log('result : ', result);
            // console.log('expectedResult : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('getArticleListPage - Input parameter : page filter', async ()=>{
        let exception = null;
        try{
            // Expected result
            const expectedResult = {
                totalCount: 1,
                data: [{
                    id: 0,
                    title: 'success',
                    content: 'dummy content',
                    username: 'username1',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: 'dummy date',
                    updatedAt: 'dummy date'
                }],
                pageInfo: { pageSize: 1, currentPage: 1, lastPage: 4 }
            }
            // Test procedure
            const inst = new ArticleService(mockRepoProvider);
            const result = await inst.getArticleListPage({page:'1', size:'1'});
            // console.log('result : ', result);
            // console.log('expectedResult : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('getArticleListPage - Input parameter : invalid page filter', async ()=>{
        let exception = null;
        try{
            // Expected result
            const expectedResult = {
                totalCount: 0,
                data: [],
                pageInfo: { pageSize: 1, currentPage: 100, lastPage: 4 }
            }
            // Test procedure
            const inst = new ArticleService(mockRepoProvider);
            const result = await inst.getArticleListPage({page:'100', size:'1'});
            // console.log('result : ', result);
            // console.log('expectedResult : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('getArticleListPage - Input parameter : invalid size filter', async ()=>{
        let exception = null;
        try{
            // Expected result
            const expectedResult = {
                totalCount: 4,
                data: [{
                    id: 0,
                    title: 'success',
                    content: 'dummy content',
                    username: 'username1',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: 'dummy date',
                    updatedAt: 'dummy date'
                },{
                    id: 1,
                    title: 'fail',
                    content: 'dummy content',
                    username: 'username2',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: 'dummy date',
                    updatedAt: 'dummy date'
                },{
                    id: 2,
                    title: 'success2',
                    content: 'dummy content',
                    username: 'username3',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: 'dummy date',
                    updatedAt: 'dummy date'
                },{
                    id: 3,
                    title: 'fail2',
                    content: 'dummy content',
                    username: 'username1',
                    passwd: '5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32',
                    createdAt: 'dummy date',
                    updatedAt: 'dummy date'
                }],
                pageInfo: { pageSize: 1000, currentPage: 1, lastPage: 1 }
            }
            // Test procedure
            const inst = new ArticleService(mockRepoProvider);
            const result = await inst.getArticleListPage({page:'1', size:'1000'});
            // console.log('result : ', result);
            // console.log('expectedResult : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('getArticleListPage - Input parameter : invalid page filter', async ()=>{
        let exception = null;
        try{
            // Expected result
            const expectedResult = {
                totalCount: 0,
                data: [],
                pageInfo: { pageSize: 1, currentPage: 100, lastPage: 4 }
            }
            // Test procedure
            const inst = new ArticleService(mockRepoProvider);
            const result = await inst.getArticleListPage({page:'100', size:'1'});
            // console.log('result : ', result);
            // console.log('expectedResult : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    /******************************************************************
     * TEST FUNCTION : addArticle
     ******************************************************************/
    test('addArticle - Invalid Repo, it should throw eception', async ()=>{
        let exception = null;
        try{
            const inst = new ArticleService(emptyRepoProvider);
            await inst.addArticle({});

        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }
        expect(exception).not.toBeNull();
    });

    test('addArticle - Invalid Repo, it should throw cError eception', async ()=>{
        const inst = new ArticleService(emptyRepoProvider);
        inst.addArticle({}).then(result=>expect(result).toThrow(cError));
    });

    test('addArticle - Invalid parameter : Empty parameter, It should throw cError with (Missing required parameter) message', async ()=>{
        const inst = new ArticleService(dummyRepoProvider);
        inst.addArticle({}).then(result=>expect(result).toThrow('Missing required parameter'));
    });

    test('addArticle - Invalid parameter : Empty title parameter, It should throw cError with (Missing required parameter) message', async ()=>{
        const invalidParameter = {username: 'username', content: 'content', passwd:'passwd'}
        const inst = new ArticleService(dummyRepoProvider);
        inst.addArticle(invalidParameter).then(result=>expect(result).toThrow('Missing required parameter'));
    });

    test('addArticle - Invalid parameter : Empty username parameter, It should throw cError with (Missing required parameter) message', async ()=>{
        const invalidParameter = {title: 'title', content: 'content', passwd:'passwd'}
        const inst = new ArticleService(dummyRepoProvider);
        inst.addArticle(invalidParameter).then(result=>expect(result).toThrow('Missing required parameter'));
    });

    test('addArticle - Invalid parameter : Empty content parameter, It should throw cError with (Missing required parameter) message', async ()=>{
        const invalidParameter = {title: 'title',username: 'username', passwd:'passwd'}
        const inst = new ArticleService(dummyRepoProvider);
        inst.addArticle(invalidParameter).then(result=>expect(result).toThrow('Missing required parameter'));
    });

    test('addArticle - Invalid parameter : Empty passwd parameter, It should throw cError with (Missing required parameter) message', async ()=>{
        const invalidParameter = {title: 'title',username: 'username', content: 'content'}
        const inst = new ArticleService(dummyRepoProvider);
        inst.addArticle(invalidParameter).then(result=>expect(result).toThrow('Missing required parameter'));
    });


    test('addArticle - Valid Parameter', async ()=>{
        let exception = null;
        try{
            const validParameter = {title: 'title',username: 'username', content: 'content', passwd:'passwd'}
            // Expected result
            const expectedResult = {
                id: 1,
                title: validParameter.title,
                content: validParameter.content,
                username: validParameter.username,
                passwd: '',
                createdAt: '2022-06-05 00:00:00',
                updatedAt: '2022-06-05 00:00:00',
            } as ArticleModel;

            // Test procedure
            const inst = new ArticleService(mockRepoProvider);
            const result = await inst.addArticle(validParameter);

            console.log(result);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });


    /******************************************************************
     * TEST FUNCTION : updateArticle
     ******************************************************************/
     test('updateArticle - Invalid Repo, it should throw eception', async ()=>{
        let exception = null;
        try{
            const inst = new ArticleService(emptyRepoProvider);
            await inst.updateArticle({},{});
            expect(inst).toBeInstanceOf(ArticleService);
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }
        expect(exception).not.toBeNull();
    });

    test('updateArticle - Invalid Repo, it should throw cError eception', async ()=>{
        const inst = new ArticleService(emptyRepoProvider);
        inst.updateArticle({},{}).then(result=>expect(result).toThrow(cError));
    });

    test('updateArticle - Invalid parameter : Empty articleParams, It should throw cError with (Missing required parameter) message', async ()=>{
        const invalidParams:ArticleParams = {  };
        const validBody:ArticleBody = { title:'title', username:'username', content:'content', passwd:'passwd'};
        const inst = new ArticleService(dummyRepoProvider);
        inst.updateArticle(invalidParams, validBody).then(result=>expect(result).toThrow('Missing required parameter'));
    });

    test('updateArticle - Invalid parameter : Empty passwd parameter, It should throw cError with (Missing required parameter) message', async ()=>{
        const validParams:ArticleParams = { id: '0' };
        const invalidBody:ArticleBody = { title:'title', username:'username', content:'content'};
        const inst = new ArticleService(dummyRepoProvider);
        inst.updateArticle(validParams, invalidBody).then(result=>expect(result).toThrow('Missing required parameter'));
    });

    test('updateArticle - Invalid ID Parameter', async ()=>{
        const validParams:ArticleParams = { id: '100' };
        const validBody:ArticleBody = { title:'title', username:'username', content:'content', passwd:'dummy passwd'};

        // Test procedure
        const inst = new ArticleService(mockRepoProvider);
        inst.updateArticle(validParams, validBody).then(result=>expect(result).toThrow('Could not find item'));
    });

    test('updateArticle - Valid Parameter', async ()=>{
        let exception = null;
        try{
            const validParams:ArticleParams = { id: '1' };
            const validBody:ArticleBody = { title:'title', username:'username', content:'content', passwd:'dummy passwd'};
            const expectedResult = 201;
            // Test procedure
            const inst = new ArticleService(mockRepoProvider);
            const result = await inst.updateArticle(validParams, validBody);
            // console.log('result : ', result);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('updateArticle - Valid Parameter : Missing username', async ()=>{
        let exception = null;
        try{
            const validParams:ArticleParams = { id: '1' };
            const validBody:ArticleBody = { title:'title', content:'content', passwd:'dummy passwd'};
            const expectedResult = 201;
            // Test procedure
            const inst = new ArticleService(mockRepoProvider);
            const result = await inst.updateArticle(validParams, validBody);
            // console.log('result : ', result);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('updateArticle - Valid Parameter : Missing content', async ()=>{
        let exception = null;
        try{
            const validParams:ArticleParams = { id: '1' };
            const validBody:ArticleBody = { title:'title', username:'username', passwd:'dummy passwd'};
            const expectedResult = 201;
            // Test procedure
            const inst = new ArticleService(mockRepoProvider);
            const result = await inst.updateArticle(validParams, validBody);
            // console.log('result : ', result);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });


    test('updateArticle - Valid Parameter : Missing title', async ()=>{
        let exception = null;
        try{
            const validParams:ArticleParams = { id: '1' };
            const validBody:ArticleBody = { username:'username', content:'content', passwd:'dummy passwd'};
            const expectedResult = 201;
            // Test procedure
            const inst = new ArticleService(mockRepoProvider);
            const result = await inst.updateArticle(validParams, validBody);
            // console.log('result : ', result);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });


    /******************************************************************
     * TEST FUNCTION : updateArticle
     ******************************************************************/
     test('deleteArticle - Invalid Repo, it should throw eception', async ()=>{
        let exception = null;
        try{
            const inst = new ArticleService(emptyRepoProvider);
            await inst.deleteArticle({},{});

        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }
        expect(exception).not.toBeNull();
    });

    test('deleteArticle - Invalid Repo, it should throw cError eception', async ()=>{
        const inst = new ArticleService(emptyRepoProvider);
        inst.deleteArticle({},{}).then(result=>expect(result).toThrow(cError));
    });

    test('deleteArticle - Invalid parameter : Empty id parameter, It should throw cError with (Missing required parameter) message', async ()=>{
        const invalidParams:ArticleParams = {  };
        const validBody:ArticleBody = { passwd:'dummy passwd'};
        const inst = new ArticleService(dummyRepoProvider);
        inst.deleteArticle(invalidParams, validBody).then(result=>expect(result).toThrow('Missing required parameter'));
    });

    test('deleteArticle - Invalid parameter : Empty passwd parameter, It should throw cError with (Missing required parameter) message', async ()=>{
        const validParams:ArticleParams = { id: '0' };
        const invalidBody:ArticleBody = { };
        const inst = new ArticleService(dummyRepoProvider);
        inst.deleteArticle(validParams, invalidBody).then(result=>expect(result).toThrow('Missing required parameter'));
    });

    test('deleteArticle - Invalid ID Parameter', async ()=>{
        const validParams:ArticleParams = { id: '100' };
        const validBody:ArticleBody = { passwd:'dummy passwd'};

        // Test procedure
        const inst = new ArticleService(mockRepoProvider);
        inst.deleteArticle(validParams, validBody).then(result=>expect(result).toThrow('Could not find item'));
    });

})