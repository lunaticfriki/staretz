export abstract class PostImageUploader {
  abstract upload(file: File): Promise<string>
}
