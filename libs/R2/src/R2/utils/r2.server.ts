import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  endpoint: `${process.env.ENDPOINT}/template`,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
  },
  region: "auto",
  forcePathStyle: true,
});
