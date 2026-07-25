import { PostImage } from '../value-objects/PostImage.valueObject'

export abstract class PostImageUploader {
  abstract upload(file: File): Promise<PostImage>
}
