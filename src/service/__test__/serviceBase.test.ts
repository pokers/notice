import { ServiceBase } from "../serviceBase";
import { Repos, QueryInput, ArticleConnection, ArticleBody, ArticleParams } from '../../type'
import { ErrMessage } from '../../lib/error'

const dummyRepoProvider = ():Repos=>{
    // console.log('dummyRepoProvider : ');
    return {} as Repos;
}

/**
 * CAUTION : The ServiceBase class is a parent class of services and it includes only protected methods.
 * therefor, it should be extended to test class and test it instead of original class.
 */
class TestClass extends ServiceBase{
    constructor(repoProvoder: ()=>Repos){
        super(repoProvoder)
    }
    public testComparePasswd(src:string, plainText:string):Boolean{
        return this.comparePasswd(src, plainText);
    }
    public testGetHashString(plainText:string):string{
        return this.getHashString(plainText)
    }
}

describe('Unit Test - ServiceBase', ()=>{
    /******************************************************************
     * TEST FUNCTION : constructor
     ******************************************************************/
     test('Instance Initialize - succeed to create instance', async ()=>{
        const inst = new TestClass(dummyRepoProvider);
        expect(inst).toBeTruthy();
        expect(inst).toBeInstanceOf(TestClass);
    });

    /******************************************************************
     * TEST FUNCTION : testGetHashString
     ******************************************************************/
     test('getHashString - success case', async ()=>{
        const inst = new TestClass(dummyRepoProvider);
        expect(inst.testGetHashString('dummy passwd')).toBe('5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32');
    });

    test('getHashString - failed case : zero length string', async ()=>{
        const inst = new TestClass(dummyRepoProvider);
        expect(()=>inst.testGetHashString('')).toThrow(ErrMessage.ErrorInvalidString);
    });
    test('getHashString - failed case : exceeded length string', async ()=>{
        const inst = new TestClass(dummyRepoProvider);
        expect(()=>inst.testGetHashString('111111111122222222223333333333444444444455555555551111111111222222222233333333334444444444555555555511111111112222222222333333333344444444445555555555111111111122222222223333333333444444444455555555551111111111222222222233333333334444444444555555555511111111112222222222333333333344444444445555555555')).
        toThrow(ErrMessage.ErrorExceedStringLength);
    });

    /******************************************************************
     * TEST FUNCTION : testComparePasswd
     ******************************************************************/
    test('comparePasswd - success case', async ()=>{
        const inst = new TestClass(dummyRepoProvider);
        expect(inst.testComparePasswd('5b4a00eadbabbc59d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32','dummy passwd')).toBeTruthy();
    });

    test('comparePasswd - failed case : diffenent hash', async ()=>{
        const inst = new TestClass(dummyRepoProvider);
        expect(inst.testComparePasswd('5b4a00eadbabbc9d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32','dummy passwd')).not.toBeTruthy();
    });

    test('comparePasswd - failed case : zero length of src string', async ()=>{
        const inst = new TestClass(dummyRepoProvider);
        expect(()=>inst.testComparePasswd('', 'dummy passwd'))
        .toThrow(ErrMessage.ErrorInvalidString);
    });

    test('comparePasswd - failed case : zero length of plainText string', async ()=>{
        const inst = new TestClass(dummyRepoProvider);
        expect(()=>inst.testComparePasswd('5b4a00eadbabbc9d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32', ''))
        .toThrow(ErrMessage.ErrorInvalidString);
    });

    test('comparePasswd - failed case : exceeded length of src string', async ()=>{
        const inst = new TestClass(dummyRepoProvider);
        expect(()=>inst.testComparePasswd('111111111122222222223333333333444444444455555555551111111111222222222233333333334444444444555555555511111111112222222222333333333344444444445555555555111111111122222222223333333333444444444455555555551111111111222222222233333333334444444444555555555511111111112222222222333333333344444444445555555555', 
        'dummy passwd'))
        .toThrow(ErrMessage.ErrorExceedStringLength);
    });

    test('comparePasswd - failed case : exceeded length of plainText string', async ()=>{
        const inst = new TestClass(dummyRepoProvider);
        expect(()=>inst.testComparePasswd('5b4a00eadbabbc9d4b439518d2d51fd28eccf3d70ad1de584618ff9e9478c32', 
        '111111111122222222223333333333444444444455555555551111111111222222222233333333334444444444555555555511111111112222222222333333333344444444445555555555111111111122222222223333333333444444444455555555551111111111222222222233333333334444444444555555555511111111112222222222333333333344444444445555555555'))
        .toThrow(ErrMessage.ErrorExceedStringLength);
    });

})