import { signal, type Signal } from '@preact/signals-core'
import type { ErrorManager } from '../../../shared/errors/application/ErrorManager.service'
import type { Page } from '../../../shared/pagination/domain/value-objects/Page.valueObject'
import type { CategoryCollection } from '../domain/collections/Category.collection'
import { Post } from '../domain/entities/Post.entity'
import { GetPostBySlugQuery } from './query/GetPostBySlug.query'
import { ListCategoriesQuery } from './query/ListCategories.query'
import { ListPostsQuery } from './query/ListPosts.query'
import type { PostReadService } from './Post.readService'

export type PostsPageState =
  | { status: 'loading' }
  | { status: 'loaded'; page: Page<Post> }
  | { status: 'error'; message: string }

export type PostBySlugState =
  | { status: 'loading' }
  | { status: 'loaded'; post: Post }
  | { status: 'not-found' }

export type CategoriesState =
  | { status: 'loading' }
  | { status: 'loaded'; categories: CategoryCollection }
  | { status: 'error'; message: string }

export abstract class PostStateService {
  abstract readonly postsPage: Signal<PostsPageState>
  abstract readonly postBySlug: Signal<PostBySlugState>
  abstract readonly categories: Signal<CategoriesState>
  abstract loadPosts(query: ListPostsQuery): Promise<void>
  abstract loadBySlug(query: GetPostBySlugQuery): Promise<void>
  abstract loadCategories(query: ListCategoriesQuery): Promise<void>
}

export class PostStateServiceImpl extends PostStateService {
  readonly postsPage = signal<PostsPageState>({ status: 'loading' })
  readonly postBySlug = signal<PostBySlugState>({ status: 'loading' })
  readonly categories = signal<CategoriesState>({ status: 'loading' })

  constructor(
    private readonly readService: PostReadService,
    private readonly errorManager: ErrorManager,
  ) {
    super()
  }

  async loadPosts(query: ListPostsQuery): Promise<void> {
    this.postsPage.value = { status: 'loading' }

    try {
      const page = await this.readService.listPosts(query)
      this.postsPage.value = { status: 'loaded', page }
    } catch (error) {
      this.postsPage.value = { status: 'error', message: (error as Error).message }
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

  async loadCategories(query: ListCategoriesQuery): Promise<void> {
    this.categories.value = { status: 'loading' }

    try {
      const categories = await this.readService.listCategories(query)
      this.categories.value = { status: 'loaded', categories }
    } catch (error) {
      this.categories.value = { status: 'error', message: (error as Error).message }
      this.errorManager.handle(error as Error)
    }
  }
}
