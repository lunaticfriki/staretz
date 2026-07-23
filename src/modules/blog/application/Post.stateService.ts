import { signal, type Signal } from '@preact/signals-core'
import type { ErrorManager } from '../../../shared/errors/application/ErrorManager.service'
import type { PostCollection } from '../domain/collections/Post.collection'
import { Post } from '../domain/entities/Post.entity'
import { GetPostBySlugQuery } from './query/GetPostBySlug.query'
import { ListLatestPostsQuery } from './query/ListLatestPosts.query'
import type { PostReadService } from './Post.readService'

export type LatestPostsState =
  | { status: 'loading' }
  | { status: 'loaded'; posts: PostCollection }
  | { status: 'error'; message: string }

export type PostBySlugState =
  | { status: 'loading' }
  | { status: 'loaded'; post: Post }
  | { status: 'not-found' }

export abstract class PostStateService {
  abstract readonly latestPosts: Signal<LatestPostsState>
  abstract readonly postBySlug: Signal<PostBySlugState>
  abstract loadLatest(query: ListLatestPostsQuery): Promise<void>
  abstract loadBySlug(query: GetPostBySlugQuery): Promise<void>
}

export class PostStateServiceImpl extends PostStateService {
  readonly latestPosts = signal<LatestPostsState>({ status: 'loading' })
  readonly postBySlug = signal<PostBySlugState>({ status: 'loading' })

  constructor(
    private readonly readService: PostReadService,
    private readonly errorManager: ErrorManager,
  ) {
    super()
  }

  async loadLatest(query: ListLatestPostsQuery): Promise<void> {
    this.latestPosts.value = { status: 'loading' }

    try {
      const posts = await this.readService.listLatest(query)
      this.latestPosts.value = { status: 'loaded', posts }
    } catch (error) {
      this.latestPosts.value = { status: 'error', message: (error as Error).message }
      this.errorManager.handle(error as Error)
    }
  }

  async loadBySlug(query: GetPostBySlugQuery): Promise<void> {
    this.postBySlug.value = { status: 'loading' }

    try {
      const post = await this.readService.getBySlug(query)
      this.postBySlug.value = { status: 'loaded', post }
    } catch {
      this.postBySlug.value = { status: 'not-found' }
    }
  }
}
