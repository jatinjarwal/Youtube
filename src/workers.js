import 'dotenv/config';
import connectDb from './db/index.js';
import './queues/video.queue.js';
import './queues/subscription.queue.js';

console.log("Initializing Background Workers...");
connectDb()
    .then(() => {
        console.log("Workers connected to the database successfully.");
        console.log("Video and Subscription workers are now listening for jobs.");
    })
    .catch((err) => {
        console.error("Worker Database connection failed:", err);
        process.exit(1);
    });