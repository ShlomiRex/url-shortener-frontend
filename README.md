# URL Shortener Frontend

Install dependencies: `npm install`

How to run: `npm run dev`

## Upload files to S3 bucket

First build the project: `npm run build`

Then upload the files to the S3 bucket using the AWS CLI. Make sure you have the AWS CLI installed and configured with your credentials:

`aws s3 sync ./dist s3://tinyurl.shlomidom.com --delete`
