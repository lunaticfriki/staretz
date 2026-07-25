import { PostImageUploader } from '../domain/repositories/PostImageUploader.repository'

export class FakePostImageUploader extends PostImageUploader {
  async upload(file: File): Promise<string> {
    return URL.createObjectURL(file)
  }
}
