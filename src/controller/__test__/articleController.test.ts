import { NextFunction, Request, Response} from 'express'
import { ArticleService } from '../../service';
import { serviceProvider } from '../../service/serviceProvider';
import { ArticleModel} from '../../repository/model'
import { ArticleConnection, Services, ArticleQuery, ArticleBody, ArticleParams } from '../../type';
import { getArticleList, addArticle, updateArticle, deleteArticle } from "../articleController";

const mockServiceFn = jest.fn();
const mockgetArticleListPage = jest.fn();
const mockaddArticle = jest.fn();
const mockUpdateArticle = jest.fn();
const mockDeleteArticle = jest.fn();
jest.mock('../../service/serviceProvider', ()=>{
    const org = jest.requireActual('../../service/serviceProvider');
    return {
        __esModule: true,
        ...org,
        // default: jest.fn(()=>console.log('default')),
        serviceProvider: ():(()=>Services)=>{
            return ():Services=>{
                mockServiceFn();
                return {
                    article: {
                        getArticleListPage: async (query:ArticleQuery):Promise<ArticleConnection>=>{
                            mockgetArticleListPage();
                            return {} as ArticleConnection;
                        },
                        addArticle: async (body:ArticleBody):Promise<ArticleModel>=>{
                            mockaddArticle();
                            return {} as ArticleModel;
                        },
                        updateArticle: async (params:ArticleParams, body:ArticleBody):Promise<number>=>{
                            mockUpdateArticle();
                            return 0;
                        },
                        deleteArticle: async (params:ArticleParams, body:ArticleBody):Promise<number>=>{
                            mockDeleteArticle();
                            return 0
                        }
                    } as ArticleService
                }
            }
        }
    }
});

describe('Unit Test - article Controller', ()=>{
    afterEach(() => {    
        jest.clearAllMocks();
      });
    /******************************************************************
     * TEST FUNCTION : getArticleList
     ******************************************************************/
    test('getArticleList - empty request params. it should run successfully', async ()=>{
        const mockRequest: any = {
            body: {
            },
        };
        const mockResponse: any = {
            json: jest.fn(),
            status: jest.fn().mockImplementation(()=>{
                return {
                    send: jest.fn()
                }
            }),
        };
        const mockNext: NextFunction = jest.fn();
        const result = await getArticleList(mockRequest, mockResponse, mockNext);

        expect(mockServiceFn).toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalled();
        

        expect(mockgetArticleListPage).toHaveBeenCalled();
        expect(mockaddArticle).not.toHaveBeenCalled();
        expect(mockUpdateArticle).not.toHaveBeenCalled();
        expect(mockDeleteArticle).not.toHaveBeenCalled();
    });

    test('getArticleList - several params. it should run successfully', async ()=>{
        const mockRequest: any = {
            query: {
                title: 'title',
                page: '1',
                size: '2',
            },
            body: {
            },
        };
        const mockResponse: any = {
            json: jest.fn(),
            status: jest.fn().mockImplementation(()=>{
                return {
                    send: jest.fn()
                }
            }),
        };
        const mockNext: NextFunction = jest.fn();
        const result = await getArticleList(mockRequest, mockResponse, mockNext);

        expect(mockServiceFn).toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalled()

        expect(mockgetArticleListPage).toHaveBeenCalled();
        expect(mockaddArticle).not.toHaveBeenCalled();
        expect(mockUpdateArticle).not.toHaveBeenCalled();
        expect(mockDeleteArticle).not.toHaveBeenCalled();
    });

    /******************************************************************
     * TEST FUNCTION : addArticle
     ******************************************************************/
     test('addArticle - empty body params. it should run successfully, because controller does not assess the parameters', async ()=>{
        const mockRequest: any = {
            body: {
            },
        };
        const mockResponse: any = {
            json: jest.fn(),
            status: jest.fn().mockImplementation(()=>{
                return {
                    send: jest.fn()
                }
            }),
        };
        const mockNext: NextFunction = jest.fn();
        const result = await addArticle(mockRequest, mockResponse, mockNext);

        expect(mockServiceFn).toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalled()

        expect(mockgetArticleListPage).not.toHaveBeenCalled();
        expect(mockaddArticle).toHaveBeenCalled();
        expect(mockUpdateArticle).not.toHaveBeenCalled();
        expect(mockDeleteArticle).not.toHaveBeenCalled();
    });

    test('addArticle - several params. it should run successfully', async ()=>{
        const mockRequest: any = {
            body: {
                title: 'title',
                username: 'username',
                content: 'content',
                passwd: 'passwd'
            },
        };
        const mockResponse: any = {
            json: jest.fn(),
            status: jest.fn().mockImplementation(()=>{
                return {
                    send: jest.fn()
                }
            }),
        };
        const mockNext: NextFunction = jest.fn();
        const result = await addArticle(mockRequest, mockResponse, mockNext);

        expect(mockServiceFn).toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalled();

        expect(mockgetArticleListPage).not.toHaveBeenCalled();
        expect(mockaddArticle).toHaveBeenCalled();
        expect(mockUpdateArticle).not.toHaveBeenCalled();
        expect(mockDeleteArticle).not.toHaveBeenCalled();
    });


    /******************************************************************
     * TEST FUNCTION : updateArticle
     ******************************************************************/
     test('updateArticle - empty body params. it should run successfully, because controller does not assess the parameters', async ()=>{
        const mockRequest: any = {
        };
        const mockResponse: any = {
            json: jest.fn(),
            status: jest.fn().mockImplementation(()=>{
                return {
                    send: jest.fn()
                }
            }),
        };
        const mockNext: NextFunction = jest.fn();
        const result = await updateArticle(mockRequest, mockResponse, mockNext);

        expect(mockServiceFn).toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalled();

        expect(mockgetArticleListPage).not.toHaveBeenCalled();
        expect(mockaddArticle).not.toHaveBeenCalled();
        expect(mockUpdateArticle).toHaveBeenCalled();
        expect(mockDeleteArticle).not.toHaveBeenCalled();
    });

    test('updateArticle - several params. it should run successfully', async ()=>{
        const mockRequest: any = {
            body: {
                title: 'title',
                username: 'username',
                content: 'content',
                passwd: 'passwd'
            },
            params:{
                id: 0
            }
        };
        const mockResponse: any = {
            json: jest.fn(),
            status: jest.fn().mockImplementation(()=>{
                return {
                    send: jest.fn()
                }
            }),
        };
        const mockNext: NextFunction = jest.fn();
        const result = await updateArticle(mockRequest, mockResponse, mockNext);

        expect(mockServiceFn).toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalled();

        expect(mockgetArticleListPage).not.toHaveBeenCalled();
        expect(mockaddArticle).not.toHaveBeenCalled();
        expect(mockUpdateArticle).toHaveBeenCalled();
        expect(mockDeleteArticle).not.toHaveBeenCalled();
    });


    /******************************************************************
     * TEST FUNCTION : deleteArticle
     ******************************************************************/
     test('deleteArticle - empty body params. it should run successfully, because controller does not assess the parameters', async ()=>{
        const mockRequest: any = {
        };
        const mockResponse: any = {
            json: jest.fn(),
            status: jest.fn().mockImplementation(()=>{
                return {
                    send: jest.fn()
                }
            }),
        };
        const mockNext: NextFunction = jest.fn();
        const result = await deleteArticle(mockRequest, mockResponse, mockNext);

        expect(mockServiceFn).toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalled();

        expect(mockgetArticleListPage).not.toHaveBeenCalled();
        expect(mockaddArticle).not.toHaveBeenCalled();
        expect(mockUpdateArticle).not.toHaveBeenCalled();
        expect(mockDeleteArticle).toHaveBeenCalled();
    });

    test('deleteArticle - several params. it should run successfully', async ()=>{
        const mockRequest: any = {
            params:{
                id: 10
            }
        };
        const mockResponse: any = {
            json: jest.fn(),
            status: jest.fn().mockImplementation(()=>{
                return {
                    send: jest.fn()
                }
            }),
        };
        const mockNext: NextFunction = jest.fn();
        const result = await deleteArticle(mockRequest, mockResponse, mockNext);

        expect(mockServiceFn).toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalled();

        expect(mockgetArticleListPage).not.toHaveBeenCalled();
        expect(mockaddArticle).not.toHaveBeenCalled();
        expect(mockUpdateArticle).not.toHaveBeenCalled();
        expect(mockDeleteArticle).toHaveBeenCalled();
    });
})