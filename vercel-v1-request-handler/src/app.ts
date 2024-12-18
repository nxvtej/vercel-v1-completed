import express from 'express'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUD_URL || "",
    credentials: {
        accessKeyId: process.env.CLOUD_ACCESS_KEY || "",
        secretAccessKey: process.env.CLOUD_SECRET_ACCESS_KEY || ""
    }
})

let counter = 0;

app.get("/v1", (req, res) => {
    res.send("Hello World")
})

app.get('/*', async (req, res) => {
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path;
    const s3Key = `dist/${id}${filePath}`;

    console.log({
        id: id,
        host: host,
        filePath: filePath
    })

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.CLOUD_BUCKET,
            Key: s3Key
        });
        const response = await s3.send(command);
        console.log(typeof response)

        if (!response.Body) {
            console.log(`File not found: ${s3Key}`);
            res.status(404).send("File not found");
            return;
        }

        const type = filePath.endsWith(".html")
            ? "text/html"
            : filePath.endsWith(".css")
                ? "text/css"
                : "application/javascript";

        res.setHeader('Content-Type', type);

        console.log(type)
        const chunks: Uint8Array[] = [];
        for await (const chunk of response.Body as any) {
            chunks.push(chunk);
        }
        const fileBuffer = Buffer.concat(chunks);

        console.log(typeof fileBuffer)
        res.send(fileBuffer);
    } catch (error) {
        counter++;
        console.error("Error fetching file from S3:.....", counter);
        console.error("Not deployed yet try later S3:", error);
        res.status(500).send("Either Not deployed yet or wrong key...\nTrust me I am a doctor......");

    }
});
/*


app.get('/v1', async (req: Request, res: Response): Promise<void> => {
    console.log("v1 server hit...")

    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path;
    const s3Key = `dist/${id}${filePath}`;

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.CLOUD_BUCKET,
            Key: s3Key
        });

        const response = await s3.send(command);

        // Check for the presence of the body to handle empty responses
        if (!response.Body) {
            console.log(`File not found: ${s3Key}`);
            res.status(404).send("File not found");
        }

        // Set correct content type
        const type = filePath.endsWith(".html")
            ? "text/html"
            : filePath.endsWith(".css")
                ? "text/css"
                : "application/javascript";

        res.setHeader('Content-Type', type);

        // Convert the response body stream to a buffer and send it
        const chunks = [];
        for await (const chunk of response.Body as any) {
            chunks.push(chunk);
        }
        const fileBuffer = Buffer.concat(chunks);

        res.send(fileBuffer);

    } catch (error) {
        console.error("Error fetching file from S3:", error);
        res.status(500).send("Error fetching file from server");
    }
});

*/
app.listen(3001, () => {
    console.log("Server is running on port 3001")
})
