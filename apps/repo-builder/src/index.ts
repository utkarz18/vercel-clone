import { exec } from 'child_process';
import { uploadDirectoryToS3 } from "./utilities/s3";
import path from 'path'

const init = () => {
    const buildId = process.env.BUILD_ID

    if (!buildId) {
        throw new Error('Invalid build!')
    }

    console.log(`Starting build for ${buildId}`)
    const gitRepoDirectory = './output'

    const buildProcess = exec(`cd ${gitRepoDirectory} && npm install && npm run build`)

    buildProcess?.stdout?.on('data', (data) => {
        console.log(data.toString())
    })

    buildProcess?.stderr?.on('error', (data) => {
        console.log('stdError', data.toString())
    })

    buildProcess?.on('close', async() => {
        console.log(`Build Completed for ${buildId}`)
        const bucketName = process.env.S3_BUCKET_NAME || 'vercel-clone-test';
        const buildDirectory = path.join(gitRepoDirectory, 'dist')
        await uploadDirectoryToS3(buildDirectory, bucketName, buildId)
    })
}

init();
