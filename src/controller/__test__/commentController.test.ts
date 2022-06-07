import { NextFunction, Request, Response} from 'express'
import { ArticleService, CommentService } from '../../service';
import { serviceProvider } from '../../service/serviceProvider';
import { ArticleModel, CommentModel} from '../../repository/model'
import { CommentBody, Connection, CommentQuery, Services } from '../../type'
import { getCommentList, addComment } from '../commentController'

const mockServiceFn = jest.fn();
const mockGetCommentListPage = jest.fn();
const mockAddComment = jest.fn();
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
                    comment: {
                        getCommentListPage: async (query:CommentQuery):Promise<Connection<CommentModel>>=>{
                            mockGetCommentListPage();
                            return {} as Connection<CommentModel>;
                        },
                        addComment: async (body:CommentBody):Promise<CommentModel>=>{
                            mockAddComment();
                            return {}as CommentModel;
                        } 
                    } as CommentService,
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
     * TEST FUNCTION : getCommentList
     ******************************************************************/
    test('getCommentList - empty request params. it should run successfully because all parameters would be checked by serveice layer', async ()=>{
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
        const result = await getCommentList(mockRequest, mockResponse, mockNext);

        expect(mockServiceFn).toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalled();

        expect(mockGetCommentListPage).toHaveBeenCalled();
        expect(mockAddComment).not.toHaveBeenCalled();
    });

    test('getCommentList - several params. it should run successfully', async ()=>{
        const mockRequest: any = {
            query: {
                username: 'username',
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
        const result = await getCommentList(mockRequest, mockResponse, mockNext);

        expect(mockServiceFn).toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalled();

        expect(mockGetCommentListPage).toHaveBeenCalled();
        expect(mockAddComment).not.toHaveBeenCalled();
    });

    /******************************************************************
     * TEST FUNCTION : addComment
     ******************************************************************/
     test('addComment - empty body params. it should run successfully, because controller does not assess the parameters', async ()=>{
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
        const result = await addComment(mockRequest, mockResponse, mockNext);

        expect(mockServiceFn).toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalled();

        expect(mockGetCommentListPage).not.toHaveBeenCalled();
        expect(mockAddComment).toHaveBeenCalled();
    });

    test('addComment - several params. it should run successfully. But the parameters are does not care on controller layer', async ()=>{
        const mockRequest: any = {
            body: {
                title: 'title',
                username: 'username',
                content: 'content'
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
        const result = await addComment(mockRequest, mockResponse, mockNext);

        expect(mockServiceFn).toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalled();

        expect(mockGetCommentListPage).not.toHaveBeenCalled();
        expect(mockAddComment).toHaveBeenCalled();
    });

})