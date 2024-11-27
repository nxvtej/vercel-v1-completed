goal is to create infinitly running loop to pull values out of redis queue

step1: get redis installed locally 
use docker command

docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
after container starts 

        PS D:\redis> docker exec -it redis-stack /bin/bash
        >>
        root@xxx:/# redis-cli ping
        PONG
        root@xxx:/# redis-cli
        127.0.0.1:6379> get build-id
        (error) WRONGTYPE Operation against a key holding the wrong kind of value
        127.0.0.1:6379> rpop build-id
        "o9n3da6ss"
        127.0.0.1:6379> lpush build-id 1sdfs5f
        (integer) 1
        127.0.0.1:6379> 
        root@xxx:/# redis-cli 
        127.0.0.1:6379> 

connect to cli 

when pushed from there 
it will immediately come in consolde due to subscriber 

function to pull from s3/r2 to server and build


then function to download folders/files from s3, many ways

one used here is using claude

here in chunks by sending getobject command to cliend
   const chunks = [];
            for await (const chunk of response.Body as any) {
                chunks.push(chunk);
            }
            const fileBuffer = Buffer.concat(chunks);

            // Write the file
            fs.writeFileSync(localFilePath, fileBuffer);
            // console.log(`Downloaded: ${object.Key}`);


now run npm build 

soo after build copy the dist folder over to the server and let is run 
building copyfinaldist(${id})