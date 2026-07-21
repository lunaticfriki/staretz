import 'reflect-metadata'
import { Container } from 'inversify'
import { PostReadServiceImpl, type PostReadService } from './modules/blog/application/Post.readService'
import { PostStateServiceImpl, type PostStateService } from './modules/blog/application/Post.stateService'
import { GetPostBySlugQueryHandler } from './modules/blog/application/query/GetPostBySlug.queryHandler'
import { ListLatestPostsQueryHandler } from './modules/blog/application/query/ListLatestPosts.queryHandler'
import type { PostRepository } from './modules/blog/domain/repositories/Post.repository'
import { FakePostRepository } from './modules/blog/infrastructure/FakePost.repository'
import { ErrorManagerImpl, type ErrorManager } from './shared/errors/application/ErrorManager.service'
import {
  NotificationServiceImpl,
  type NotificationService,
} from './shared/notifications/application/NotificationService.service'
import {
  NotificationStateServiceImpl,
  type NotificationStateService,
} from './shared/notifications/application/Notification.stateService'
import { TYPES } from './shared/di/types'

const container = new Container()

container
  .bind<PostRepository>(TYPES.PostRepository)
  .toDynamicValue(() => new FakePostRepository())
  .inSingletonScope()

container
  .bind<PostReadService>(TYPES.PostReadService)
  .toDynamicValue(
    (context) =>
      new PostReadServiceImpl(
        new ListLatestPostsQueryHandler(context.get<PostRepository>(TYPES.PostRepository)),
        new GetPostBySlugQueryHandler(context.get<PostRepository>(TYPES.PostRepository)),
      ),
  )
  .inSingletonScope()

container
  .bind<NotificationService>(TYPES.NotificationService)
  .toDynamicValue(() => new NotificationServiceImpl())
  .inSingletonScope()

container
  .bind<NotificationStateService>(TYPES.NotificationStateService)
  .toDynamicValue(
    (context) => new NotificationStateServiceImpl(context.get<NotificationService>(TYPES.NotificationService)),
  )
  .inSingletonScope()

container
  .bind<ErrorManager>(TYPES.ErrorManager)
  .toDynamicValue(
    (context) => new ErrorManagerImpl(context.get<NotificationStateService>(TYPES.NotificationStateService)),
  )
  .inSingletonScope()

container
  .bind<PostStateService>(TYPES.PostStateService)
  .toDynamicValue(
    (context) =>
      new PostStateServiceImpl(
        context.get<PostReadService>(TYPES.PostReadService),
        context.get<ErrorManager>(TYPES.ErrorManager),
      ),
  )
  .inSingletonScope()

export { container }
