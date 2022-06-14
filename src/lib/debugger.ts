import { log } from './logger';
import v8 from 'v8';
import fs from 'fs';
import heapdump from 'heapdump';

class Debugger {
    constructor(){

    }

    showHeapStatistics(){
        try{
            const heapStatisticsStream = v8.getHeapStatistics();
            log.info('heapStatistics : ', JSON.stringify(heapStatisticsStream));
        }catch(e){
            log.error(e);
            throw e;
        }
    }

    createHeapSnapshot(){
        try{
            const heapSnapshotStream = v8.getHeapSnapshot();
            const postfix = Date.now();
            const heapFileName = `heapSnapshot_${postfix}.heapsnapshot`;
            const heapStream = fs.createWriteStream(heapFileName);
            heapSnapshotStream.pipe(heapStream);
            
        }catch(e){
            log.error(e);
            throw e;
        }
    }

    createHeapDump(){
        try{
            const postfix = Date.now();
            const heapdumpFileName = `hapdump_${postfix}.heapsnapshot`;
            heapdump.writeSnapshot(heapdumpFileName);
            
        }catch(e){
            log.error(e);
            throw e;
        }
    }

    async collectHeapInfo(){
        try{
            this.createHeapDump();
            this.createHeapSnapshot();
            this.showHeapStatistics();
        }catch(e){
            log.error(e);
            throw e;
        }
    }
}

export { Debugger }