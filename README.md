# RedisDistro

A fast and reliable **Redis-based distributed queue system** written in **TypeScript**.  
Ideal for tasks like **email delivery** and **background job processing**.

## Features
- Redis-powered queue with retries and dead-letter support  
- Worker-based task processing  
- TypeScript-first design  

## Getting Started

### Install & Setup
```bash
git clone https://github.com/Saloni1707/RedisDistro.git
cd RedisDistro
npm install
```

Create a `.env` file:
```env
REDIS_URL=redis://localhost:6379
QUEUE_KEY=queue:emails
DEAD_KEY=queue:dead
```

### Run
```bash
npm run build
npm start
```

## Usage
Push tasks into the queue and let workers process them with retries and error handling.

---

