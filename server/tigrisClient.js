const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: "us-east-1", // any region, Tigris ignores it
  endpoint: process.env.TIGRIS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.TIGRIS_ACCESS_KEY,
    secretAccessKey: process.env.TIGRIS_SECRET_KEY,
  },
});

module.exports = { s3Client, PutObjectCommand };
