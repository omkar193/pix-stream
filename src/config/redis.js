const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null, // ✅ Required for BullMQ to prevent errors
    enableReadyCheck: false, // ✅ Improves connection handling
});

redisClient.on("connect", () => {
    console.log("✅ Connected to Redis");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis Connection Error:", err);
});

redisClient.on("reconnecting", () => {
    console.warn("⚠️ Redis is reconnecting...");
});

redisClient.on("end", () => {
    console.log("🔴 Redis connection closed.");
});

module.exports = redisClient;