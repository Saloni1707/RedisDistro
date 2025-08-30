import {pushTask} from "../utils/queue.js";
import type {EmailTask} from "../types/task.js";

export async function enqueueEmailTask(to:string,subject:string,body:string,runAt?:number){
    const task:EmailTask={
        type:"sendEmail",
        to,
        subject,
        body
    };
    return pushTask(task,runAt);
}
    