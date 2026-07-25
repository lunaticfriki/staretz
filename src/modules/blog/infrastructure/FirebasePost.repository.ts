import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import { PostCollection } from '../domain/collections/Post.collection'
import { Post } from '../domain/entities/Post.entity'
import { PostRepository } from '../domain/repositories/Post.repository'
import { Slug } from '../domain/value-objects/Slug.valueObject'
import { FirestorePostMapper } from './acl/FirestorePost.mapper'
import { firestore } from './firebaseApp'

const POSTS_COLLECTION = 'posts'

export class FirebasePostRepository extends PostRepository {
  async findAll(): Promise<PostCollection> {
    const snapshot = await getDocs(collection(firestore, POSTS_COLLECTION))
    const posts = snapshot.docs.map((document) => FirestorePostMapper.toDomain(document.data()))
    return PostCollection.create(posts)
  }

  async findBySlug(slug: Slug): Promise<Post | null> {
    const snapshot = await getDocs(
      query(collection(firestore, POSTS_COLLECTION), where('slug', '==', slug.toString()), limit(1)),
    )
    const document = snapshot.docs[0]
    return document ? FirestorePostMapper.toDomain(document.data()) : null
  }
}
