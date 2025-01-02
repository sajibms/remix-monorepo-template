import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./utils/r2.server";
import { UploadedFile } from "./file";


export const uploadFile = async (file: string, bufferData: Buffer) => {
  const command = new PutObjectCommand({
    Bucket: "template",
    Key: file ?? "template",
    Body: bufferData,
    ContentType: ".png",
  });
  const result = await s3Client.send(command);
  return result;
};

export const convertDataToBuffer = async (
  data: AsyncIterable<Uint8Array>,
): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of data) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);
  return buffer;
};

export const convertDataToString = async (
  data: AsyncIterable<Uint8Array>,
  name: string,
  formFields: Record<string, string>,
) => {
  const chunks = [];
  for await (const chunk of data) chunks.push(chunk);
  formFields[name] = Buffer.concat(chunks).toString("utf-8");
  return formFields[name];
};

export const generateFileURL = (
  uploadedFiles: Record<string, UploadedFile>,
  filename: string,
  name: string,
) => {
  uploadedFiles[name] = {
    filename,
    url: `${process.env.BUCKET_URL}/template/${filename}`,
  };
  return uploadedFiles[name].url;
};
