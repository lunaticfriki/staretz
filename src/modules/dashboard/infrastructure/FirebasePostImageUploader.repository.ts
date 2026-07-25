import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { PostImageUploader } from '../domain/repositories/PostImageUploader.repository'
import { storage } from './storage'

export class FirebasePostImageUploader extends PostImageUploader {
  async upload(file: File): Promise<string> {
    const fileRef = ref(storage, `posts/${Date.now()}-${file.name}`)
    await uploadBytes(fileRef, file)
    return getDownloadURL(fileRef)
  }
}
