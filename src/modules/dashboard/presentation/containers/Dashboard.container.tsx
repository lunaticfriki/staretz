import type { RouteProps } from '../../../../shared/presentation/RouteProps'
import { useAuthState } from '../../../../shared/presentation/useAuthState.hook'
import { PublishPostCommand } from '../../application/command/PublishPost.command'
import { usePublishPostState } from '../usePublishPostState.hook'
import { PostForm, type PostFormValues } from '../components/PostForm.component'

export function DashboardContainer(_props: RouteProps) {
  const { logout } = useAuthState()
  const { publish, publishPost } = usePublishPostState()

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
      ),
    )
  }

  return (
    <section class="mx-auto max-w-2xl">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-purple-700 dark:text-purple-400">Nou article</h1>
        <button
          type="button"
          onClick={logout}
          class="text-sm text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-200"
        >
          Tanca sessió
        </button>
      </div>
      <PostForm onSubmit={handleSubmit} submitting={publish.status === 'submitting'} />
    </section>
  )
}
