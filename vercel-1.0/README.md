<!-- @format -->

commands:-

git clone xx

npm i

create env

add s3/r2 buckets secrets

CLOUD_ACCESS_KEY = xxyxx

CLOUD_SECRET_ACCESS_KEY = xxyxx

CLOUD_URL = https://{accound id}.r2.cloudflarestorage.com

CLOUD_BUCKET=vercel

tsc -b

node dist/index.js

hit deploy with body repoUrl : "github url for demo react app"

will return id

set the status to uploaded, then id will be in redis

will be picked by deploy service and download files and buid it and then reuplaod it

mean while statyus can be checked by polling status end point

later hand off to 3rd service
