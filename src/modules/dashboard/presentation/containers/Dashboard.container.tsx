import { useState } from 'preact/hooks'
import { container } from '../../../../composition-root'
import type { RouteProps } from '../../../../shared/presentation/RouteProps'
import { useAuthState } from '../../../../shared/presentation/useAuthState.hook'
import type { NotificationStateService } from '../../../../shared/notifications/application/Notification.stateService'
import { TYPES } from '../../../../shared/di/types'
import { CreatePostCommand } from '../../../blog/application/command/CreatePost.command'
import type { PostWriteService } from '../../../blog/application/Post.writeService'
import type { PostImageUploader } from '../../../blog/domain/repositories/PostImageUploader.repository'
import { PostForm, type PostFormValues } from '../components/PostForm.component'

export function DashboardContainer(_props: RouteProps) {
  const { logout } = useAuthState()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(values: PostFormValues) {
    const notifications = container.get<NotificationStateService>(TYPES.NotificationStateService)
    setSubmitting(true)

    try {
      if (!values.imageFile) {
        throw new Error("Selecciona una imatge per a l'article.")
      }

      const uploader = container.get<PostImageUploader>(TYPES.PostImageUploader)
      const writeService = container.get<PostWriteService>(TYPES.PostWriteService)

      const image = await uploader.upload(values.imageFile)

      await writeService.createPost(
        new CreatePostCommand(
          values.slug,
          values.title,
          values.excerpt,
          values.content,
          values.author,
          values.category,
          values.publishedAt,
          image.toString(),
        ),
      )

      notifications.notify('success', 'Article publicat correctament.')
    } catch (error) {
      notifications.notify('error', (error as Error).message)
    } finally {
      setSubmitting(false)
    }
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
      <PostForm onSubmit={handleSubmit} submitting={submitting} />
    </section>
  )
}
