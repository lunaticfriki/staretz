import 'reflect-metadata'
import { Container } from 'inversify'
import { CreatePostCommandHandler } from './modules/blog/application/command/CreatePost.commandHandler'
import { DeletePostCommandHandler } from './modules/blog/application/command/DeletePost.commandHandler'
import { UpdatePostCommandHandler } from './modules/blog/application/command/UpdatePost.commandHandler'
import { PostReadServiceImpl, type PostReadService } from './modules/blog/application/Post.readService'
import { PostStateServiceImpl, type PostStateService } from './modules/blog/application/Post.stateService'
import { PostWriteServiceImpl, type PostWriteService } from './modules/blog/application/Post.writeService'
import { GetPostBySlugQueryHandler } from './modules/blog/application/query/GetPostBySlug.queryHandler'
import { ListCategoriesQueryHandler } from './modules/blog/application/query/ListCategories.queryHandler'
import { ListPostsQueryHandler } from './modules/blog/application/query/ListPosts.queryHandler'
import type { PostRepository } from './modules/blog/domain/repositories/Post.repository'
import { FakePostRepository } from './modules/blog/infrastructure/FakePost.repository'
import { FirebasePostRepository } from './modules/blog/infrastructure/FirebasePost.repository'
import { EditPostCommandHandler } from './modules/dashboard/application/command/EditPost.commandHandler'
import { PublishPostCommandHandler } from './modules/dashboard/application/command/PublishPost.commandHandler'
import {
  PostManagementStateServiceImpl,
  type PostManagementStateService,
} from './modules/dashboard/application/PostManagement.stateService'
import { DASHBOARD_ACCESS_POLICY } from './modules/dashboard/dashboardPolicy'
import type { PostImageUploader } from './modules/dashboard/domain/repositories/PostImageUploader.repository'
import { FakePostImageUploader } from './modules/dashboard/infrastructure/FakePostImageUploader.repository'
import { FirebasePostImageUploader } from './modules/dashboard/infrastructure/FirebasePostImageUploader.repository'
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

// e2e builds point these at the in-memory Fake* adapters instead of real
// Firebase — real Firestore rejects reads/writes carrying an ID token
// issued by the local Auth emulator (see scripts/e2e.sh), so testing the
// dashboard against a real project isn't possible without also running
// the Firestore/Storage emulators (Java-dependent, not wired up here).
const useFakeRepositories = import.meta.env.VITE_USE_FAKE_REPOSITORIES === 'true'

container
  .bind<PostRepository>(TYPES.PostRepository)
  .toDynamicValue(() => (useFakeRepositories ? new FakePostRepository() : new FirebasePostRepository()))
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
      new PostWriteServiceImpl(
        new CreatePostCommandHandler(context.get<PostRepository>(TYPES.PostRepository)),
        new UpdatePostCommandHandler(context.get<PostRepository>(TYPES.PostRepository)),
        new DeletePostCommandHandler(context.get<PostRepository>(TYPES.PostRepository)),
      ),
  )
  .inSingletonScope()

container
  .bind<PostImageUploader>(TYPES.PostImageUploader)
  .toDynamicValue(() => (useFakeRepositories ? new FakePostImageUploader() : new FirebasePostImageUploader()))
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

container
  .bind<PostManagementStateService>(TYPES.PostManagementStateService)
  .toDynamicValue(
    (context) =>
      new PostManagementStateServiceImpl(
        new PublishPostCommandHandler(
          context.get<PostImageUploader>(TYPES.PostImageUploader),
          context.get<PostWriteService>(TYPES.PostWriteService),
        ),
        new EditPostCommandHandler(
          context.get<PostImageUploader>(TYPES.PostImageUploader),
          context.get<PostWriteService>(TYPES.PostWriteService),
        ),
        context.get<PostWriteService>(TYPES.PostWriteService),
        context.get<NotificationStateService>(TYPES.NotificationStateService),
        context.get<ErrorManager>(TYPES.ErrorManager),
      ),
  )
  .inSingletonScope()

export { container }
