import { Redis } from "ioredis";

export default class RedisSubscriberService {
    private redisUrl: string
    private subscriber: Redis;

    constructor(redisUrl: string) {
        this.redisUrl = redisUrl;
        this.subscriber = new Redis(this.redisUrl);
    }

    subscribe = (channel: string, cb?: (message: string, channel:string, pattern?: string) => void) => {
        this.subscriber.psubscribe(channel)
        this.subscriber.on('pmessage', (pattern, channel, message) => {
            !cb ? console.log(message) : cb(message, channel, pattern);
        })
    }
}