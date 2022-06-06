import { NotifyService } from '../notifyService'
import { Repos, QueryInput } from '../../type'
import { cError, ErrMessage } from '../../lib/error'
import { NoticeRepository } from '../../repository'
import { ArticleModel, CommentModel, KeywordModel } from '../../repository/model'

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

/******************************************************************
 * CAUTION : There is no strictly unit test of NotifyClass due to dummy class 
 ******************************************************************/
describe('Unit Test notifyService', ()=>{

    /******************************************************************
     * TEST FUNCTION : constructor
     ******************************************************************/
    test('Instance Initialize - succeed to create instance', async ()=>{
        const inst = new NotifyService(dummyRepoProvider);
        expect(inst).toBeTruthy();
        expect(inst).toBeInstanceOf(NotifyService);
    });

    /******************************************************************
     * TEST FUNCTION : retrieveKeywork
     ******************************************************************/
     test('retrieveKeywork - Invalid repo, it does not care ', async ()=>{
        let exception = null;
        try{
            const inst = new NotifyService(emptyRepoProvider);
            await inst.retrieveKeywork({});
            expect(inst).toBeTruthy();
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }
        expect(exception).toBeNull();
    });

     test('retrieveKeywork - Invalid content parameter, it should NOT call getKeyworkList() method', async ()=>{
        let exception = null;
        try{
            let isCalled:boolean = false;
            const mockRepoProvider = ():Repos=>{
                const repositories:Repos = {}
                repositories.notice = {
                    getKeywordList: async():Promise<KeywordModel[]>=>{
                        isCalled = true;
                        return [];
                    }
                } as NoticeRepository
                return repositories;
            }

            const inst = new NotifyService(mockRepoProvider);
            await inst.retrieveKeywork({});
            expect(isCalled).not.toBeTruthy();
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('retrieveKeywork - valid content parameter, it should call getKeywordList method ', async ()=>{
        let exception = null;
        try{
            let isCalled:boolean = false;
            const mockRepoProvider = ():Repos=>{
                const repositories:Repos = {}
                repositories.notice = {
                    getKeywordList: async():Promise<KeywordModel[]>=>{
                        // console.log('called!!')
                        isCalled = true;
                        return [];
                    }
                } as NoticeRepository
                return repositories;
            }
            const inst = new NotifyService(mockRepoProvider);
            await inst.retrieveKeywork({content: 'test'});
            expect(isCalled).toBeTruthy();
        }catch(e){
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }
        expect(exception).toBeNull();
    });

    test('retrieveKeywork - valid content parameter, it should call sendNotification method ', async ()=>{
        let exception = null;
        try{
            const spySendNotification = jest.spyOn(NotifyService.prototype, 'sendNotification')

            let isCalled:boolean = false;
            // Mock method
            const mockRepoProvider = ():Repos=>{
                const repositories:Repos = {}
                repositories.notice = {
                    getKeywordList: async():Promise<KeywordModel[]>=>{
                        // console.log('called!!')
                        isCalled = true;
                        return [];
                    }
                } as NoticeRepository
                return repositories;
            }

            const inst = new NotifyService(mockRepoProvider);
            await inst.retrieveKeywork({content: 'test'});
            expect(isCalled).toBeTruthy();
            expect(spySendNotification).toBeCalled();
            expect(spySendNotification).toBeCalledTimes(1);
            expect(spySendNotification).toHaveBeenCalled();
            return;
        }catch(e){
            // console.log(e);
            expect(e).toBeInstanceOf(cError);
            expect((e as Error).message).toBe('Module not found');
            exception = e;
        }
        expect(exception).toBeNull();
    });

});