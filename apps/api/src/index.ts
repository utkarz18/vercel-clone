
import dotenv from "dotenv";
import Fastify from 'fastify';
import { generateSlug } from 'random-word-slugs';
import DeployRequest from './entities/deployRequest';
import KubernetesService from "./services/kubernetesService";
import RedisSubscriberService from './services/redisSubscriberService';

dotenv.config({ path: './.env' })

const PORT = process.env.PORT || 8000
const namespace = process.env.NAMESPACE || 'default'

const kubernetesService = new KubernetesService();
const subscriber = new RedisSubscriberService(process.env.REDIS_URL!)
subscriber.subscribe('log*', async (message, channel) => {
    console.log(channel, message);
    if (message.includes('Task Completed')) {
        await kubernetesService.cleanUpGitRepoBuilderPod(namespace);
    }
});

const fastify = Fastify({
    logger: false
})

fastify.get('/api/health', async (request, reply) => {
    reply.type('application/json').code(200)
    return;
});

fastify.post('/api/deploy', async (request, reply) => {
    const { repoUrl, slug } = request.body as DeployRequest
    try {
        const projectSlug = slug || generateSlug();
        await kubernetesService.triggerGitRepoBuilderPod(repoUrl, projectSlug, namespace);
        reply.type('application/json').code(200)
        return { websiteUrl: `${projectSlug}.${process.env.CONTENT_RESOLVER_URL}` }
    } catch (err: any) {
        reply.type('application/json').code(400)
        console.log(err)
        return { error: err.message }
    }
})

fastify.listen({ port: +PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on port ${PORT}`)
})