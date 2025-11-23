export interface ICloudflareR2Client {
  uploadFile(params: {
    file: Buffer;
    fileName: string;
    contentType: string;
    folder?: string;
  }): Promise<{
    url: string;
    key: string;
  }>;

  deleteFile(key: string): Promise<void>;

  getFileUrl(key: string): string;
}
