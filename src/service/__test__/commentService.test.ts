import { CommentService } from "../commentService";
import { Repos, QueryInput } from '../../type'
import { cError, ErrMessage } from '../../lib/error'
import { NoticeRepository } from '../../repository'
import { ArticleModel, CommentModel } from '../../repository/model'

const emptyRepoProvider = ():Repos=>{
    // console.log('emptyRepoProvider : ');
    return {};
}

const dummyRepoProvider = ():Repos=>{
    // console.log('dummyRepoProvider : ');
    const repositories:Repos = {}
    repositories.notice = {
        getCommentListAndTotalCount: async (query: QueryInput, offset: number, limit:number ):Promise<{data: CommentModel[], count: number}>=>{
            // console.log('called getCommentListAndTotalCount');
            return {data: [], count: 0};
        }
    } as NoticeRepository
    return repositories;
}

// Dummy data
const dummyArticleData = {
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

// Mocking Object
const mockRepoProvider = ():Repos=>{
    const repositories:Repos = {}
    repositories.notice = {
        getArticleListAndTotalCount: async (query: QueryInput, offset: number, limit:number ):Promise<{data: ArticleModel[], count: number}>=>{
            const {title, username } = query;
            // console.log('Mocked function > getArticleListAndTotalCount - input params : ', query, offset, limit);
            const result = JSON.parse(JSON.stringify(dummyArticleData));

            if(username){
                result.data = dummyArticleData.data.filter(item=>{
                    return item.username === username;
                })
                result.count = result.data.length;
            }
            if(title){
                result.data = dummyArticleData.data.filter(item=>{
                    return item.title === title;
                })
                result.count = result.data.length;
            }
            if(username && title){
                result.data = dummyArticleData.data.filter(item=>{
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
             const index = dummyArticleData.data.findIndex(item=>item.id===articleId);
             if(index >= 0){
                 return dummyArticleData.data[index];
             }

            return null;
        },
        updateArticle: async (articleId:number, query: QueryInput):Promise<ArticleModel|null>=>{
            const index = dummyArticleData.data.findIndex(item=>item.id===articleId);
             if(index >= 0){
                 if(query.title){
                    dummyArticleData.data[index].title = query.title;
                 }
                 if(query.content){
                    dummyArticleData.data[index].content = query.content;
                 }
                 
             }

            return null;
        },
        getCommentListAndTotalCount: async (query: QueryInput, offset: number, limit:number ):Promise<{data: CommentModel[], count: number}>=>{
            const {articleId, username } = query;
            // console.log('Mocked function > getCommentListAndTotalCount - input params : ', query, offset, limit);
            const result = JSON.parse(JSON.stringify(dummyCommentData));

            if(username){
                result.data = dummyCommentData.data.filter(item=>{
                    return item.username === username;
                })
                result.count = result.data.length;
            }
            if(articleId){
                result.data = dummyCommentData.data.filter(item=>{
                    return item.id === articleId;
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
        addComment: async (query: QueryInput):Promise<CommentModel>=>{
            // console.log('mocked addComment query : ', query);
            const { articleId, parentId, username, content} = query;
            if(articleId != undefined && username && content){
                return {
                    id: 0,
                    articleId: articleId,
                    parentId: parentId,
                    content: content,
                    username: username,
                    createdAt: '2022-06-05 00:00:00',
                } as CommentModel;
            }
            throw new Error('Exception addComment');
        },
    } as NoticeRepository
    return repositories;
}


describe('Unit Test commentService', ()=>{

    /******************************************************************
     * TEST FUNCTION : constructor
     ******************************************************************/
    test('Instance Initialize - succeed to create instance', async ()=>{
        const inst = new CommentService(dummyRepoProvider);
        expect(inst).toBeTruthy();
        expect(inst).toBeInstanceOf(CommentService);
    });


    /******************************************************************
     * TEST FUNCTION : getCommentListPage
     ******************************************************************/
     test('getCommentListPage - Invalid repo, it should throw exception', async ()=>{
        let exception = null;
        try{
            const inst = new CommentService(emptyRepoProvider);
            await inst.getCommentListPage({});
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }
        expect(exception).not.toBeNull();
    });

    test('getCommentListPage - Invalid repo, it should throw cError exception', async ()=>{
        const inst = new CommentService(emptyRepoProvider);
        inst.getCommentListPage({}).then(result=>expect(result).toThrow(cError));
    });

    test('getCommentListPage - valid repo, it would not throw exception but do not care result', async ()=>{
        let exception = null;
        try{
            const inst = new CommentService(dummyRepoProvider);
            await inst.getCommentListPage({});
        }catch(e){
            // console.log('exception : ', e);
            exception = e;
        }

        expect(exception).toBeNull();
    });


    test('getCommentListPage - Input parameter : the result should be All dummy data ', async ()=>{
        let exception = null;
        try{
            // Expected result
            const expectedResult = {
                totalCount: 4,
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
                },{
                    id: 2,
                    articleId: 2,
                    parentId: 0,
                    content: 'dummy content',
                    username: 'username2',
                    createdAt: 'dummy date'
                },{
                    id: 3,
                    articleId: 2,
                    parentId: null,
                    content: 'dummy content',
                    username: 'username2',
                    createdAt: 'dummy date'
                }],
                pageInfo: { pageSize: 50, currentPage: 1, lastPage: 1 }
            }

            // Test procedure
            const inst = new CommentService(mockRepoProvider);
            const result = await inst.getCommentListPage({});
            // console.log('1 result : ', result);
            // console.log('1 dummy : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('getCommentListPage - Input parameter : article ID filter test', async ()=>{
        let exception = null;
        try{
            // Expected result
            const expectedResult = {
                totalCount: 1,
                data: [{
                    id: 2,
                    articleId: 2,
                    parentId: 0,
                    content: 'dummy content',
                    username: 'username2',
                    createdAt: 'dummy date'
                }],
                pageInfo: { pageSize: 50, currentPage: 1, lastPage: 1 }
            }
            // Test procedure
            const inst = new CommentService(mockRepoProvider);
            const result = await inst.getCommentListPage({articleId: '2'});
            // console.log('result : ', result);
            // console.log('expectedResult : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('getCommentListPage - Input parameter : username filter test', async ()=>{
        let exception = null;
        try{
            // Expected result
            const expectedResult = {
                totalCount: 2,
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
                pageInfo: { pageSize: 50, currentPage: 1, lastPage: 1 }
            }
            // Test procedure
            const inst = new CommentService(mockRepoProvider);
            const result = await inst.getCommentListPage({username: 'username1'});
            // console.log('result : ', result);
            // console.log('expectedResult : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });


    test('getCommentListPage - Input parameter : page filter test', async ()=>{
        let exception = null;
        try{
            // Expected result
            const expectedResult = {
                totalCount: 1,
                data: [{
                    id: 0,
                    articleId: 0,
                    parentId: null,
                    content: 'dummy content',
                    username: 'username1',
                    createdAt: 'dummy date'
                }],
                pageInfo: { pageSize: 1, currentPage: 1, lastPage: 4 }
            }
            // Test procedure
            const inst = new CommentService(mockRepoProvider);
            const result = await inst.getCommentListPage({page:'1', size: '1'});
            // console.log('result : ', result);
            // console.log('expectedResult : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('getCommentListPage - Input parameter : invalid page filter test', async ()=>{
        let exception = null;
        try{
            // Expected result
            const expectedResult = {
                totalCount: 0,
                data: [],
                pageInfo: { pageSize: 1, currentPage: 100, lastPage: 4 }
            }
            // Test procedure
            const inst = new CommentService(mockRepoProvider);
            const result = await inst.getCommentListPage({page:'100', size: '1'});
            // console.log('result : ', result);
            // console.log('expectedResult : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('getCommentListPage - Input parameter : invalid size filter test', async ()=>{
        let exception = null;
        try{
            // Expected result
            const expectedResult = {
                totalCount: 4,
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
                },{
                    id: 2,
                    articleId: 2,
                    parentId: 0,
                    content: 'dummy content',
                    username: 'username2',
                    createdAt: 'dummy date'
                },{
                    id: 3,
                    articleId: 2,
                    parentId: null,
                    content: 'dummy content',
                    username: 'username2',
                    createdAt: 'dummy date'
                }],
                pageInfo: { pageSize: 100, currentPage: 1, lastPage: 1 }
            }
            // Test procedure
            const inst = new CommentService(mockRepoProvider);
            const result = await inst.getCommentListPage({page:'1', size: '100'});
            // console.log('result : ', result);
            // console.log('expectedResult : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });

    /******************************************************************
     * TEST FUNCTION : addComment
     ******************************************************************/
     test('addComment - Invalid repo, it should throw exception', async ()=>{
        let exception = null;
        try{
            const inst = new CommentService(emptyRepoProvider);
            await inst.addComment({});
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }
        expect(exception).not.toBeNull();
    });

    test('addComment - Invalid repo, it should throw cError exception', async ()=>{
        const inst = new CommentService(emptyRepoProvider);
        inst.addComment({}).then(result=>expect(result).toThrow(cError));
    });

    test('addComment - Invalid parameter : Empty parameters, It should throw cError', async ()=>{
        // const invalidParameter = {articleId: '0', parentId: '0', username: 'username', content: 'content'};
        const inst = new CommentService(dummyRepoProvider);
        inst.addComment({}).then(result=>expect(result).toThrow(ErrMessage.ErrorInvalidBodyParameter));
    });

    test('addComment - Invalid parameter : Empty article Id parameters, It should throw cError', async ()=>{
        const invalidParameter = {parentId: '0', username: 'username', content: 'content'};
        const inst = new CommentService(dummyRepoProvider);
        inst.addComment(invalidParameter).then(result=>expect(result).toThrow(ErrMessage.ErrorInvalidBodyParameter));
    });

    test('addComment - Invalid parameter : Empty username parameters, It should throw cError', async ()=>{
        const invalidParameter = {articleId: '0', parentId: '0', content: 'content'};
        const inst = new CommentService(dummyRepoProvider);
        inst.addComment(invalidParameter).then(result=>expect(result).toThrow(ErrMessage.ErrorInvalidBodyParameter));
    });

    test('addComment - Invalid parameter : Empty content parameters, It should throw cError', async ()=>{
        const invalidParameter = {articleId: '0', parentId: '0', username: 'username'};
        const inst = new CommentService(dummyRepoProvider);
        inst.addComment(invalidParameter).then(result=>expect(result).toThrow(ErrMessage.ErrorInvalidBodyParameter));
    });

    test('addComment - Invalid articleId Parameter', async ()=>{
        const invalidParameter = {articleId: '100', username: 'username', content: 'content'};
        const inst = new CommentService(dummyRepoProvider);
        inst.addComment(invalidParameter).then(result=>expect(result).toThrow(ErrMessage.ErrorItemNotFound));
    });

    test('addComment - Valid Parameter', async ()=>{
        let exception = null;
        try{
            const validParameter = {articleId: '0', username: 'username', content: 'content'};
            // Expected result
            const expectedResult = {
                id: 0,
                articleId: parseInt(validParameter.articleId),
                parentId: null,
                content: validParameter.content,
                username: validParameter.username,
                createdAt: '2022-06-05 00:00:00',
            } as CommentModel;

            // Test procedure
            const inst = new CommentService(mockRepoProvider);
            const result = await inst.addComment(validParameter);

            console.log('result : ', result);
            console.log('Expected Result : ', expectedResult);
            expect(result).toStrictEqual(expectedResult);
        }catch(e){
            exception = e;
        }
        expect(exception).toBeNull();
    });


});