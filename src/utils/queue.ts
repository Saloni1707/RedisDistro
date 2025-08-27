import {redis,QUEUE_KEY,DEAD_LETTER_KEY,METRICS_KEY} from "../config/redis.js";
import crypto from 'crypto'
import type {StoredTask,EmailTask} from "../types/task.js";

const MAX_RETRIES=4;

export async function pushTask(task: EmailTask) {
    const id=crypto.randomUUID();
    const payload:StoredTask={
        id,
        task,
        attempts:0,
    }
    await redis.lpush(QUEUE_KEY,JSON.stringify(payload));
    return id;
}

//pop from queue
export async function popTask():Promise<StoredTask|null>{
    const payload=await redis.rpop(QUEUE_KEY);
    if(!payload){
        return null;
    }
    return JSON.parse(payload) as StoredTask;

}

export async function completeTask(id:string){
    await redis.incr(METRICS_KEY.processed);
}

//try a failed task
export async function failTask(stored:StoredTask,error?:string):Promise<void>{
    stored.attempts +=1;
    if(error){
        (stored as any).lastError = error;
    }
    if (stored.attempts>=MAX_RETRIES){
        await redis.rpush(DEAD_LETTER_KEY,JSON.stringify(stored));
        await redis.incr(METRICS_KEY.failed);
    }else{
        await redis.lpush(QUEUE_KEY,JSON.stringify(stored));
        await redis.incr(METRICS_KEY.failed);
    }
}

export async function getQueueStats(){
    const [queued,dead,processed,failed]=await Promise.all([
        redis.llen(QUEUE_KEY),
        redis.llen(DEAD_LETTER_KEY),
        redis.get(METRICS_KEY.failed),
        redis.get(METRICS_KEY.processed)
    ]);
    return {
        queued,
        dead,
        processed,
        failed
    };
}
