import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { PostImage } from '../domain/value-objects/PostImage.valueObject'
import { PostImageUploader } from '../domain/repositories/PostImageUploader.repository'
import { storage } from './storage'

export class FirebasePostImageUploader extends PostImageUploader {
  async upload(file: File): Promise<PostImage> {
    const fileRef = ref(storage, `posts/${Date.now()}-${file.name}`)
    await uploadBytes(fileRef, file)
    const url = await getDownloadURL(fileRef)
    return PostImage.create(url)
  }
}
