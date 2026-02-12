// backend/config/redis.js
import { createClient } from 'redis';

const redisClient = createClient({
    url: 'redis://redis:6379' // Agar local chala rahe ho
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

await redisClient.connect();
console.log("Redis Connected Successfully");

export default redisClient;