import {processTasks} from "./processor.js";
import {getMetrics} from "./metrics.js";
import {moveDueScheduledTasks} from "../utils/queue.js";

async function startWorker(){
    console.log("Worker started...")
    processTasks();

    //process the scheduled tasks
    setInterval(async ()=> {
        await moveDueScheduledTasks();
    },5000);
    
    setInterval(async ()=> {
        const metrics=await getMetrics();
        console.log("Worker metrics:",metrics)

    },1000)
}

startWorker();