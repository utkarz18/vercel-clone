import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs'
import path from 'path'

const options = {
    region: 'ap-south-1',
    endpoint: 'https://s3.ap-south-1.amazonaws.com'
}

export const uploadDirectoryToS3 = async (directoryPath: string, bucketName: string, prefix: string) => {
    const allFilesAndDirectories = fs.readdirSync(directoryPath);
    for (const file of allFilesAndDirectories) {
        const filePath = path.join(directoryPath, file);
        const key = path.join(prefix, file);
        if (!filePath.includes('.git')) {
            if (fs.statSync(filePath).isDirectory()) {
                await uploadDirectoryToS3(filePath, bucketName, key);
            } else {
                await uploadFileToS3(filePath, bucketName, key);
            }
        }
    }
}

export const uploadFileToS3 = async (filePath: string, bucketName: string, key: string) => {
    const fileContent = fs.readFileSync(filePath);

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
    };

    try {
        const s3Client = new S3Client(options);
        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        console.log(`File uploaded: s3://${bucketName}/${key}`);
    } catch (error) {
        console.error(`Error uploading file ${filePath} to S3:`, error);
    }
}