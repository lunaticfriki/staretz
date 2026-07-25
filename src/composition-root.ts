import 'reflect-metadata'
import { Container } from 'inversify'
import { PostReadServiceImpl, type PostReadService } from './modules/blog/application/Post.readService'
import { PostStateServiceImpl, type PostStateService } from './modules/blog/application/Post.stateService'
import { GetPostBySlugQueryHandler } from './modules/blog/application/query/GetPostBySlug.queryHandler'
import { ListCategoriesQueryHandler } from './modules/blog/application/query/ListCategories.queryHandler'
import { ListPostsQueryHandler } from './modules/blog/application/query/ListPosts.queryHandler'
import type { PostRepository } from './modules/blog/domain/repositories/Post.repository'
import { FirebasePostRepository } from './modules/blog/infrastructure/FirebasePost.repository'
import { ErrorManagerImpl, type ErrorManager } from './shared/errors/application/ErrorManager.service'
import {
  NotificationServiceImpl,
  type NotificationService,
} from './shared/notifications/application/NotificationService.service'
import {
  NotificationStateServiceImpl,
  type NotificationStateService,
} from './shared/notifications/application/Notification.stateService'
import { ThemeStateServiceImpl, type ThemeStateService } from './shared/theme/application/Theme.stateService'
import type { ThemeRepository } from './shared/theme/domain/repositories/Theme.repository'
import { BrowserThemeRepository } from './shared/theme/infrastructure/BrowserTheme.repository'
import { TYPES } from './shared/di/types'

const container = new Container()

container
  .bind<PostRepository>(TYPES.PostRepository)
  .toDynamicValue(() => new FirebasePostRepository())
  .inSingletonScope()

container
  .bind<PostReadService>(TYPES.PostReadService)
  .toDynamicValue(
    (context) =>
      new PostReadServiceImpl(
        new ListPostsQueryHandler(context.get<PostRepository>(TYPES.PostRepository)),
        new GetPostBySlugQueryHandler(context.get<PostRepository>(TYPES.PostRepository)),
        new ListCategoriesQueryHandler(context.get<PostRepository>(TYPES.PostRepository)),
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

container
  .bind<ThemeRepository>(TYPES.ThemeRepository)
  .toDynamicValue(() => new BrowserThemeRepository())
  .inSingletonScope()

container
  .bind<ThemeStateService>(TYPES.ThemeStateService)
  .toDynamicValue((context) => new ThemeStateServiceImpl(context.get<ThemeRepository>(TYPES.ThemeRepository)))
  .inSingletonScope()

export { container }
