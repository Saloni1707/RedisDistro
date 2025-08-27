import express from "express";
import bodyParser from "body-parser";
import { enqueueEmailTask } from "./enqueue.js";
import { getQueueLengths } from "../config/redis.js";

const app = express();
app.use(bodyParser.json());

app.get("/health", (req: any, res: any) => {
  res.json({ status: "ok" });
});

app.post("/enqueue/email", async (req: any, res: any) => {
  try {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const id = await enqueueEmailTask(to, subject, body);
    res.status(200).json({ message: "Task enqueued", taskId: id });
  } catch (err) {
    console.error("Error enqueuing task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/metrics", async (req: any, res: any) => {
  const stats = await getQueueLengths();
  res.json(stats);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Producer API listening on port ${PORT}`);
});
