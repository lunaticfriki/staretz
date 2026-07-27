export abstract class PostImageUploader {
  abstract upload(file: File): Promise<string>

  uploadMany(files: File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.upload(file)))
  }
}
