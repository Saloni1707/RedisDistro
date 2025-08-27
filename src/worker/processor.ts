import { popTask, completeTask, failTask } from "../utils/queue.js";
import { sendEmail } from "../tasks/sendEmail.js";
import { logger } from "../utils/logger.js";
import type { StoredTask } from "../types/task.js";

export async function processTasks() {
  while (true) {
    const stored = await popTask();
    if (!stored) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    const { id, task } = stored;
    try {
      switch (task.type){
        case "sendEmail":
          await sendEmail(task.task);
          break;
        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }

      await completeTask(id);
      logger.success(`Task ${id} completed`);
    } catch (err) {
      logger.error(`Task ${id} failed: ${(err as Error).message}`);
      await failTask(stored);
    }
  }
}
