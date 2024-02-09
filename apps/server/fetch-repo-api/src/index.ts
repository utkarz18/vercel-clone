import Fastify from 'fastify'
import DeployRequest from './entities/deployRequest'
import path from 'path'
import fetchGitRepo from './utilities/git'

const PORT = process.env.PORT || 8000

const fastify = Fastify({
    logger: false
})

fastify.post('/deploy', async (request, reply) => {
    const deployRequest = request.body as DeployRequest
    try {
        const buildId = await fetchGitRepo(deployRequest.repoUrl, __dirname);
        reply.type('application/json').code(200)
        return { buildId }
    } catch (err: any) {
        reply.type('application/json').code(400)
        return { error: err.message }
    }
    
})

fastify.listen({ port: +PORT }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on port ${PORT}`)
})