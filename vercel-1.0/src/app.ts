import express from 'express'
import cors from 'cors'
import path from 'path'
import rateLimit from 'express-rate-limit'

import { deleteAllObjects, uploadfiletoBucket } from './cloudflare'
import { generateRandomId } from './utils'
import { getAllFiles } from './getAllFiles'
import { simpleGit } from 'simple-git'
import { createClient } from 'redis'
import dotenv from 'dotenv'

import fs from 'fs'

dotenv.config()
const publisher = createClient();
const subscriber = createClient();
const app = express()
const port = process.env.PORT || 8000;
const git = simpleGit()

app.use(cors())
app.use(express.json())
publisher.connect()
subscriber.connect()


const deployRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 2,
})

app.post('/deploy', deployRateLimiter, async (req, res) => {

    const repoUrl = req.body.repoUrl
    const userCustomId = req.body.id

    console.log("github repo link:", repoUrl)
    const id = userCustomId ? userCustomId : generateRandomId()

    console.log("cloning id:", id)
    // await git.clone(repoUrl, `output/${id}`) inside root dir

    const outputDir = path.join(__dirname, `output/${id}`)
    await git.clone(repoUrl, outputDir)// inside dist folder cause of path.join(__dirname, `output/${id}`)
    const files = getAllFiles(outputDir)


    console.log("uploading...")

    for (const file of files) {
        const relativePath = path.relative(outputDir, file)
        const s3Key = path.join(`output/${id}`, relativePath).replace(/\\/g, '/')
        await uploadfiletoBucket(s3Key, file)
        console.log(`Uploaded... ${s3Key}`)
    }


    publisher.lPush("build-id", id)
    // set is llike insert 
    publisher.hSet("status", id, "uploaded")

    console.log("files uploaded .")
    /*
        try {
            console.log("cleaning the localDir");
            await fs.promises.rm(outputDir, { recursive: true, force: true });
        } catch (error) {
            console.error(error)
        }
    
    */
    res.status(200).json({
        message: "repo copied into ouput under id",
        id: id
    })
})



const statusRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 25,
})


app.get("/status", statusRateLimiter, async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string)
    res.json({
        status: response
    })
})



const deleteRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1,
})

app.get("/delete", deleteRateLimiter, async (req, res) => {
    // const id = req.query.id;
    const bucket = "vercel"
    deleteAllObjects(bucket);

    res.json({
        message: "All files deleted"
    })

})


app.listen(port, () => {
    console.log(`Server is running on port ${port}...`)
})

/*
app.post('/deploy', async (req, res) => {
    try {
        // Upload all files while maintaining directory structure
        const uploadResults = await s3Service.uploadDirectory(outputDir, `output/${id}`);

        // Check for any upload failures
        const failures = uploadResults.filter(result => !result.success);
        if (failures.length > 0) {
            console.error('Some files failed to upload:', failures);
            return res.status(500).json({
                message: 'Some files failed to upload',
                failures,
                id
            });
        }
        // Clean up: Remove local files after successful upload
        await fs.promises.rm(outputDir, { recursive: true, force: true });

        res.status(200).json({
            message: "Repository successfully deployed",
            id: id
        });
    } catch (error) {
        console.error('Deploy error:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});
*/




