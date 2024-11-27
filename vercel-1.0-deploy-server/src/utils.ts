import { exec } from "child_process";
import path from "path";
import fs from 'fs';


export function buildProject(id: string) {
    return new Promise((resolve, reject) => {
        console.log("running commands, npm i , npm run build")
        exec(`cd ${path.join(__dirname, `output/${id}`)} && npm install && npm run build`, (err, stdout, stderr) => {
            if (err) {
                console.log("couldn't build")
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
}


export const getAllFiles = (folderpath: string) => {
    console.log(`getting all files for ${folderpath}`)
    let response: string[] = [];

    const allFilesAndFolder = fs.readdirSync(folderpath);
    allFilesAndFolder.forEach(file => {
        const fullFilePath = path.join(folderpath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            // no push as function returns array and not simple file, so
            response = response.concat(getAllFiles(fullFilePath));
        } else {
            response.push(fullFilePath);
        }
    })
    return response;
}



import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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

    console.log(`file uploading.... ${fileName}`)
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