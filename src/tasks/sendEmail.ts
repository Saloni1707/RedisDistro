import {logger} from "../utils/logger.js";
import type { EmailTask } from "../types/task.js";

export async function sendEmail(task:EmailTask){
    logger.info(`Sending email to ${task.to}`);
    await new Promise((res)=>setTimeout(res,1000));
    logger.success(`Email sent to ${task.to}`);
}
