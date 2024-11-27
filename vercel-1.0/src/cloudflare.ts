import { S3Client, ListObjectsV2Command, DeleteObjectsCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();


const S3_ENDPOINT = process.env.CLOUD_URL;
const S3_BUCKET = process.env.CLOUD_BUCKET;
const S3_ACCESS_KEY = process.env.CLOUD_ACCESS_KEY;
const S3_SECRET_KEY = process.env.CLOUD_SECRET_ACCESS_KEY;

if (!S3_SECRET_KEY || !S3_ENDPOINT || !S3_BUCKET || !S3_ACCESS_KEY) {

    throw new Error("cant access private variables")
}
const s3Bucket = new S3Client({
    region: "auto",
    endpoint: S3_ENDPOINT,
    credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
    },
});
// fileName => ouput/${id}/src/app.jsx
// localFilePath => /users/nxvtej/vercel-1.0/dist/output/123/src/app.jsx
export const uploadfiletoBucket = async (fileName: string, localFilePath: string) => {

    const fileContent = fs.readFileSync(localFilePath)

    try {
        const command = new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: fileName,
            Body: fileContent
        })
        await s3Bucket.send(command);
    }
    catch (e) {
        console.log(e)
    }
}

export async function deleteAllObjects(bucketName: string) {
    const listCommand = new ListObjectsV2Command({ Bucket: bucketName });
    const listedObjects = await s3Bucket.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        console.log("Bucket is already empty.");
        return;
    }

    // Prepare delete request
    const deleteCommand = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key })) },
    });

    await s3Bucket.send(deleteCommand);
    console.log("All objects have been deleted.");
}


/*
// cloudflare.ts

interface UploadResult {
    success: boolean;
    key?: string;
    error?: string;
}

export class S3UploadService {
    private bucket: string;

    constructor(bucket: string) {
        this.bucket = bucket;
    }

    async uploadFile(fileName: string, localFilePath: string): Promise<UploadResult> {
        try {
            const fileContent = await fs.promises.readFile(localFilePath);

            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: fileName,
                Body: fileContent
            });

            await s3Client.send(command);
            return { success: true, key: fileName };
        } catch (error) {
            console.error(`Error uploading file ${fileName}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async uploadDirectory(localDir: string, s3Prefix: string = ''): Promise<UploadResult[]> {
        const results: UploadResult[] = [];
        const files = getAllFiles(localDir);

        for (const file of files) {
            // Calculate relative path from the local directory
            const relativePath = path.relative(localDir, file);
            // Combine with S3 prefix while maintaining structure
            const s3Key = path.join(s3Prefix, relativePath).replace(/\\/g, '/');

            const result = await this.uploadFile(s3Key, file);
            results.push(result);
        }

        return results;
    }
}*/