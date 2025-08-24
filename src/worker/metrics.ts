import { getQueueLengths } from "../config/redis.mjs";
import {redis,METRICS_KEY} from "../config/redis.js";

export async function getMetrics(){
    const lengths=await getQueueLengths();
    const [processed,failed]=await redis.mget(
        METRICS_KEY.processed,
        METRICS_KEY.failed,
    );
    return {
        queued:lengths.queued,
        dead:lengths.dead,
        processed:Number(processed ?? 0),
        failed:Number(failed ?? 0),
    };
}