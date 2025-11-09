export interface IStorageService {
  uploadPhoto(params: {
    file: Buffer;
    fileName: string;
    contentType: string;
    folder?: string;
  }): Promise<{
    url: string;
    key: string;
  }>;

  uploadPhotos(params: {
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
  >;
}
