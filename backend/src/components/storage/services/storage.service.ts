import { inject, injectable } from "inversify";
import { INFRASTRUCTURE_TYPES } from "../../../dependencies/types";
import type { ICloudflareR2Client } from "../../../infrastructure/storage/ICloudflareR2Client";
import type { IStorageService } from "./storage.service.interface";

@injectable()
export class StorageService implements IStorageService {
  constructor(
    @inject(INFRASTRUCTURE_TYPES.ICloudflareR2Client)
    private readonly cloudflareR2Client: ICloudflareR2Client
  ) {}

  async uploadPhoto(params: {
    file: Buffer;
    fileName: string;
    contentType: string;
    folder?: string;
  }): Promise<{ url: string; key: string }> {
    return this.cloudflareR2Client.uploadFile({
      file: params.file,
      fileName: params.fileName,
      contentType: params.contentType,
      folder: params.folder,
    });
  }

  async uploadPhotos(params: {
    files: Array<{
      buffer: Buffer;
      originalName: string;
      mimetype: string;
    }>;
    folder?: string;
  }): Promise<
    Array<{
      url: string;
      key: string;
      originalName: string;
    }>
  > {
    const uploadPromises = params.files.map((file) =>
      this.cloudflareR2Client
        .uploadFile({
          file: file.buffer,
          fileName: file.originalName,
          contentType: file.mimetype,
          folder: params.folder,
        })
        .then((result) => ({
          ...result,
          originalName: file.originalName,
        }))
    );

    return Promise.all(uploadPromises);
  }
}
