import type { RouteProps } from '../../../../shared/presentation/RouteProps'
import { useAuthState } from '../../../../shared/presentation/useAuthState.hook'
import { PublishPostCommand } from '../../application/command/PublishPost.command'
import { usePostManagementState } from '../usePostManagementState.hook'
import { DashboardNav } from '../components/DashboardNav.component'
import { PostForm, type PostFormValues } from '../components/PostForm.component'

export function NewPostContainer(_props: RouteProps) {
  const { logout } = useAuthState()
  const { publish, publishPost } = usePostManagementState()

  function handleSubmit(values: PostFormValues) {
    publishPost(
      new PublishPostCommand(
        values.slug,
        values.title,
        values.excerpt,
        values.content,
        values.author,
        values.category,
        values.publishedAt,
        values.imageFile,
        values.galleryFiles,
      ),
    )
  }

  return (
    <section class="w-full">
      <DashboardNav onLogout={logout} />
      <h1 class="mt-6 text-2xl font-bold text-purple-700 dark:text-purple-400">Nou article</h1>
      <div class="max-w-5xl">
        <PostForm onSubmit={handleSubmit} submitting={publish.status === 'submitting'} />
      </div>
    </section>
  )
}
