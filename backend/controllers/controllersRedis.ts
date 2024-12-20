import { createHash } from "crypto";
import { withLogging } from "../utils/withLogging";
import { redisClient } from "../redis/redisClient";
import type { Request, Response } from "express";

export const redisTest = withLogging("redisTest", false, async (req: Request, res: Response) => {
  const cacheKey = createHash("sha256").update(JSON.stringify(req.body)).digest("hex");
  console.log(cacheKey);

  // Try getting cached data; if in cache, return
  const cachedData = await redisClient.get(`cache:${cacheKey}`);
  console.log(cachedData);
  if (cachedData) {
    console.log("Cache hit on key: ", cacheKey);
    console.log("cachedData: ", cachedData);
    res.status(200).json(JSON.parse(cachedData));
  } else {
    // Add a small delay to simulate an expensive operation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // If not in cache, fetch from main data source and store in Redis for 60 min
    const newData = {
      id: "123",
      country: "US",
      category: "Clothing",
    };
    await redisClient.setex(`cache:${cacheKey}`, 3600, JSON.stringify(newData));
    console.log("loaded on Redis");
    res.status(200).json(newData);
  }
});
