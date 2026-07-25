import { PostImage } from '../domain/value-objects/PostImage.valueObject'
import { PostImageUploader } from '../domain/repositories/PostImageUploader.repository'

export class FakePostImageUploader extends PostImageUploader {
  async upload(file: File): Promise<PostImage> {
    return PostImage.create(URL.createObjectURL(file))
  }
}
