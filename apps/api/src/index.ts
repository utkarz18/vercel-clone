
import dotenv from "dotenv";
import Fastify from 'fastify';
import { generateSlug } from 'random-word-slugs';
import DeployRequest from './entities/deployRequest';
import KubernetesService from "./services/kubernetesService";
import RedisSubscriberService from './services/redisSubscriberService';

dotenv.config({ path: './.env' })

const PORT = process.env.PORT || 8000

const kubernetesService = new KubernetesService();
const subscriber = new RedisSubscriberService(process.env.REDIS_URL!)
subscriber.subscribe('log*', async (message, channel) => {
    console.log(channel, message);
    if (message.includes('Task Completed')) {
        const projectSlug = channel.split(':')[-1]
        await kubernetesService.cleanUpGitRepoBuilderPod(projectSlug!);
    }
});

const fastify = Fastify({
    logger: false
})

fastify.post('/deploy', async (request, reply) => {
    const { repoUrl, slug } = request.body as DeployRequest
    try {
        const projectSlug = slug || generateSlug();
        await kubernetesService.triggerGitRepoBuilderPod(repoUrl, projectSlug);
        reply.type('application/json').code(200)
        return { websiteUrl: `${projectSlug}.${process.env.CONTENT_RESOLVER_URL}` }
    } catch (err: any) {
        reply.type('application/json').code(400)
        return { error: err.message }
    }
})

fastify.listen({ port: +PORT }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on port ${PORT}`)
})