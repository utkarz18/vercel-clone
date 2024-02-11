import Fastify from 'fastify';
import DeployRequest from './entities/deployRequest';
import fetchGitRepo from './utilities/git';
import { uploadDirectoryToS3 } from './utilities/s3';

const PORT = process.env.PORT || 8000

const fastify = Fastify({
    logger: false
})

fastify.post('/deploy', async (request, reply) => {
    const deployRequest = request.body as DeployRequest
    try {
        const {buildId, targetDirectory} = await fetchGitRepo(deployRequest.repoUrl, __dirname);

        const bucketName = process.env.S3_BUCKET_NAME || 'vercel-clone-test';
        await uploadDirectoryToS3(targetDirectory, bucketName, buildId)

        // publish event to redis queue

        // BONUS: Display logs via websocket
        console.log("method completed");
        reply.type('application/json').code(200)
        return { buildId: "dd" }
    } catch (err: any) {
        reply.type('application/json').code(400)
        return { error: err.message }
    }
    
})

fastify.listen({ port: +PORT }, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on port ${PORT}`)
})