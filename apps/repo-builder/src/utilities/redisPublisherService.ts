import { Redis } from "ioredis";

export default class RedisPublisher {
    private redisUrl: string
    private publisher: Redis;

    constructor(redisUrl: string) {
        this.redisUrl = redisUrl;
        this.publisher = new Redis(this.redisUrl);
    }

    publish = (message: string, channel: string) => {
        this.publisher.publish(channel, JSON.stringify({message}));
    }
}