import { injectable, inject } from "inversify";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import type { ILogger } from "../../lib/logger/logger.interface";
import { LIBS_TYPES } from "../../dependencies/types";
import type { ICloudflareR2Client } from "./ICloudflareR2Client";

@injectable()
export class CloudflareR2Client implements ICloudflareR2Client {
  private readonly s3Client: S3Client | null = null;
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor(
    @inject(LIBS_TYPES.ILogger)
    private readonly logger: ILogger
  ) {
    const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    this.bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "";
    this.publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || "";

    if (!accountId || !accessKeyId || !secretAccessKey || !this.bucketName) {
      this.logger.warn(
        "Cloudflare R2 configuration is missing. Please set CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, and CLOUDFLARE_R2_BUCKET_NAME environment variables."
      );
      return;
    }

    this.s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(params: {
    file: Buffer;
    fileName: string;
    contentType: string;
    folder?: string;
  }): Promise<{ url: string; key: string }> {
    if (!this.s3Client) {
      throw new Error("Cloudflare R2 client not initialized");
    }

    const timestamp = Date.now();
    const sanitizedFileName = params.fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = params.folder
      ? `${params.folder}/${timestamp}-${sanitizedFileName}`
      : `${timestamp}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: params.file,
      ContentType: params.contentType,
    });

    await this.s3Client.send(command);

    const url = this.publicUrl
      ? `${this.publicUrl}/${key}`
      : `https://${this.bucketName}.r2.cloudflarestorage.com/${key}`;

    return { url, key };
  }

  async deleteFile(key: string): Promise<void> {
    if (!this.s3Client) {
      throw new Error("Cloudflare R2 client not initialized");
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  getFileUrl(key: string): string {
    if (!this.s3Client) {
      throw new Error("Cloudflare R2 client not initialized");
    }

    return this.publicUrl
      ? `${this.publicUrl}/${key}`
      : `https://${this.bucketName}.r2.cloudflarestorage.com/${key}`;
  }
}
