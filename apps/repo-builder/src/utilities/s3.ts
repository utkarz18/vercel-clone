import { S3Client, PutObjectCommand, PutObjectCommandInput, S3ClientConfig } from "@aws-sdk/client-s3";
import fs from 'fs'
import path from 'path'
import mime from 'mime-types'

const options: S3ClientConfig = {
    region: process.env.REGION!,
    endpoint: `https://s3.${process.env.REGION!}.amazonaws.com`,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
        sessionToken: process.env.SESSION_TOKEN ? process.env.SESSION_TOKEN : ''
    }
}

export const uploadDirectoryToS3 = async (directoryPath: string, bucketName: string, prefix: string) => {
    const allFilesAndDirectories = fs.readdirSync(directoryPath, { recursive: true });
    const s3Client = new S3Client(options);
    for (const file of allFilesAndDirectories) {
        const filePath = path.join(directoryPath, file.toString());
        if (fs.lstatSync(filePath).isDirectory()) continue

        const key = `${prefix}/${file}`;
        await uploadFileToS3(filePath, bucketName, key, s3Client);
    }
}

export const uploadFileToS3 = async (filePath: string, bucketName: string, key: string, client?: S3Client) => {
    const s3Client = client ? client : new S3Client(options);
    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: fs.createReadStream(filePath),
            ContentType: mime.lookup(filePath) || 'application/octet-stream'
        });
        await s3Client.send(command);

        console.log(`File uploaded: s3://${bucketName}/${key}`);
    } catch (error) {
        console.error(`Error uploading file ${filePath} to S3:`, error);
    }
}