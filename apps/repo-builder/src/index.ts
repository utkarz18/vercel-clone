import { exec } from 'child_process';
import { uploadDirectoryToS3 } from "./utilities/s3";
import path from 'path'
import RedisPublisher from './utilities/redisPublisherService';

const buildId = process.env.BUILD_ID
const publisher = new RedisPublisher(process.env.REDIS_URL!)
const publisherChannel = `log:${buildId}`;

const init = () => {

    if (!buildId) {
        throw new Error('Invalid build!')
    }

    publishLog('Build Started!')
    const gitRepoDirectory = './output'

    const buildProcess = exec(`cd ${gitRepoDirectory} && npm install && npm run build`)

    buildProcess?.stdout?.on('data', (data) => {
        publishLog(data.toString())
    })

    buildProcess?.stderr?.on('error', (data) => {
        publishLog(data.toString(), 'ERROR')
    })

    buildProcess?.on('close', async() => {
        publishLog('Build Completed!')
        const bucketName = process.env.BUCKET_NAME!;
        const buildDirectory = path.join(gitRepoDirectory, 'dist')
        await uploadDirectoryToS3(buildDirectory, bucketName, buildId)
        publishLog('Task Completed')
    })
}

const publishLog = (message: string, logLevel: 'ERROR' | 'DEBUG' | 'INFO' = 'INFO') => {
    message = logLevel ? `${logLevel}: ${message}` : message;
    console.log(message)
    publisher.publish(message, publisherChannel)
}

init();
