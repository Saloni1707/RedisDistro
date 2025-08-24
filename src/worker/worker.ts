import {processTasks} from "./processor.js";
import {getMetrics} from "./metrics.js";

async function startWorker(){
    console.log("Worker started...")
    processTasks();
    setInterval(async ()=> {
        const metrics=await getMetrics();
        console.log("Worker metrics:",metrics)

    },1000)
}

startWorker();