import { randomBytes, createHash } from 'crypto';
import { Repos } from "../type";
import { log } from '../lib/logger'
import { ErrorInvalidString, ErrorExceedStringLength } from '../lib/error';

class ServiceBase {
    protected repoProvider:()=>Repos;
    constructor(repoProvoder: ()=>Repos){
        this.repoProvider = repoProvoder;
    }
    
    protected comparePasswd(src:string, plainText:string):Boolean{
        try{
            if(src.length <= 0 || plainText.length <= 0){
                throw ErrorInvalidString();
            }
            if(src.length >= 255 || plainText.length >= 255){
                throw ErrorExceedStringLength();
            }

            const hashString = this.getHashString(plainText);
            log.info('src : ', src);
            log.info('plainText : ', plainText);
            return (src.localeCompare(hashString) === 0)
        }catch(e){
            log.error('exception > comparePasswd : ', e);
            throw e;
        }
    }

    protected getHashString(plainText:string):string{
        try{
            if(plainText.length <= 0){
                throw ErrorInvalidString();
            }
            if(plainText.length >= 255){
                throw ErrorExceedStringLength();
            }

            const salt:string = randomBytes(128).toString('base64');
            /***********************************************
             * CAUTION & TODO : Bascially, it should use salt value for ramdomize of hash, but here now, 
             *  it would not use it due to example code.
             ***********************************************/
            const hashString:string = createHash('sha256').update(plainText).digest('hex');
            log.info('Hash Value : ', hashString);
            return hashString;
        }catch(e){
            log.error('exception > getHashString : ', e);
            throw e;
        }
    }
}

export { ServiceBase }