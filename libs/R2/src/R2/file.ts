export interface UploadedFile {
  filename: string;
  url: string;
}

export type FormFields = Record<string, string>;

export interface IR2UploadFile {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
  ACL: string;
}

export type R2BucketKey = "template" | "Others";
