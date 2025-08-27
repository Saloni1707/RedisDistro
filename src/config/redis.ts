import 'dotenv/config'
import {Redis} from 'ioredis' 

export const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379")

export const QUEUE_KEY = process.env.QUEUE_KEY ?? "queue:emails"; //main queue list jobs pushed here
export const DEAD_LETTER_KEY = process.env.DEAD_KEY ?? "queue:dead"; //failed jobs are moved here permanently


export const METRICS_KEY={
    processed:"metrics:processed",
    failed:"metrics:failed",
};


export async function getQueueLengths():Promise<{queued:number,dead:number}> {
    const results = await redis
        .multi()
        .llen(QUEUE_KEY)
        .llen(DEAD_LETTER_KEY)
        .exec();

    // Handle case where results is null (transaction failed)
    if (!results) {
        return { queued: 0, dead: 0 };
    }

    // Extract results from the multi-exec response
    const [mainQueueResult, deadLetterResult] = results;
    
    return {
        queued: (mainQueueResult?.[1] as number) ?? 0,
        dead: (deadLetterResult?.[1] as number) ?? 0
    };
}