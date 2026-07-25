import 'reflect-metadata'
import { Container } from 'inversify'
import { CreatePostCommandHandler } from './modules/blog/application/command/CreatePost.commandHandler'
import { PostReadServiceImpl, type PostReadService } from './modules/blog/application/Post.readService'
import { PostStateServiceImpl, type PostStateService } from './modules/blog/application/Post.stateService'
import { PostWriteServiceImpl, type PostWriteService } from './modules/blog/application/Post.writeService'
import { GetPostBySlugQueryHandler } from './modules/blog/application/query/GetPostBySlug.queryHandler'
import { ListCategoriesQueryHandler } from './modules/blog/application/query/ListCategories.queryHandler'
import { ListPostsQueryHandler } from './modules/blog/application/query/ListPosts.queryHandler'
import type { PostImageUploader } from './modules/blog/domain/repositories/PostImageUploader.repository'
import type { PostRepository } from './modules/blog/domain/repositories/Post.repository'
import { FirebasePostImageUploader } from './modules/blog/infrastructure/FirebasePostImageUploader.repository'
import { FirebasePostRepository } from './modules/blog/infrastructure/FirebasePost.repository'
import { DASHBOARD_ACCESS_POLICY } from './modules/dashboard/dashboardPolicy'
import { AuthStateServiceImpl, type AuthStateService } from './shared/auth/application/Auth.stateService'
import type { AuthRepository } from './shared/auth/domain/repositories/Auth.repository'
import { FirebaseAuthRepository } from './shared/auth/infrastructure/FirebaseAuth.repository'
import { ErrorManagerImpl, type ErrorManager } from './shared/errors/application/ErrorManager.service'
import {
  NotificationServiceImpl,
  type NotificationService,
} from './shared/notifications/application/NotificationService.service'
import {
  NotificationStateServiceImpl,
  type NotificationStateService,
} from './shared/notifications/application/Notification.stateService'
import { PolicyServiceImpl, type PolicyService } from './shared/policies/application/Policy.service'
import type { Policy } from './shared/policies/domain/Policy'
import { RequireAuthenticationPolicy } from './shared/policies/domain/policies/RequireAuthentication.policy'
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
  .bind<PostWriteService>(TYPES.PostWriteService)
  .toDynamicValue(
    (context) =>
      new PostWriteServiceImpl(new CreatePostCommandHandler(context.get<PostRepository>(TYPES.PostRepository))),
  )
  .inSingletonScope()

container
  .bind<PostImageUploader>(TYPES.PostImageUploader)
  .toDynamicValue(() => new FirebasePostImageUploader())
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

container
  .bind<AuthRepository>(TYPES.AuthRepository)
  .toDynamicValue(() => new FirebaseAuthRepository())
  .inSingletonScope()

container
  .bind<AuthStateService>(TYPES.AuthStateService)
  .toDynamicValue((context) => new AuthStateServiceImpl(context.get<AuthRepository>(TYPES.AuthRepository)))
  .inSingletonScope()

container
  .bind<PolicyService>(TYPES.PolicyService)
  .toDynamicValue(() => {
    const policies = new Map<string, Policy>([
      [DASHBOARD_ACCESS_POLICY.toString(), new RequireAuthenticationPolicy()],
    ])
    return new PolicyServiceImpl(policies)
  })
  .inSingletonScope()

export { container }
