import { route } from 'preact-router'
import { useEffect } from 'preact/hooks'
import type { RouteProps } from '../../../../shared/presentation/RouteProps'
import { useAuthState } from '../../../../shared/presentation/useAuthState.hook'
import { usePostBySlugState } from '../../../blog/presentation/usePostBySlugState.hook'
import { EditPostCommand } from '../../application/command/EditPost.command'
import { usePostManagementState } from '../usePostManagementState.hook'
import { DashboardNav } from '../components/DashboardNav.component'
import { PostForm, type PostFormValues } from '../components/PostForm.component'

interface EditPostContainerProps extends RouteProps {
  slug?: string
}

export function EditPostContainer({ slug = '' }: EditPostContainerProps) {
  const { logout } = useAuthState()
  const postState = usePostBySlugState(slug)
  const { edit, editPost } = usePostManagementState()

  useEffect(() => {
    if (edit.status === 'submitted') {
      route('/dashboard')
    }
  }, [edit.status])

  function handleSubmit(values: PostFormValues) {
    if (postState.status !== 'loaded') {
      return
    }

    editPost(
      new EditPostCommand(
        slug,
        values.title,
        values.excerpt,
        values.content,
        values.author,
        values.category,
        values.publishedAt,
        postState.post.image.toString(),
        values.imageFile,
        values.keptGalleryUrls,
        values.galleryFiles,
      ),
    )
  }

  return (
    <section class="w-full">
      <DashboardNav onLogout={logout} />
      <h1 class="mt-6 text-2xl font-bold text-purple-700 dark:text-purple-400">Edita l'article</h1>
      {postState.status === 'loading' && <p class="mt-6 text-gray-500 dark:text-gray-400">Carregant...</p>}
      {postState.status === 'not-found' && (
        <p class="mt-6 text-red-600 dark:text-red-400">No s'ha trobat aquest article.</p>
      )}
      {postState.status === 'loaded' && (
        <div class="max-w-5xl">
          <PostForm
            onSubmit={handleSubmit}
            submitting={edit.status === 'submitting'}
            initialValues={{
              slug: postState.post.slug.toString(),
              title: postState.post.title.toString(),
              excerpt: postState.post.excerpt.toString(),
              content: postState.post.content.toString(),
              author: postState.post.author.toString(),
              category: postState.post.category.toString(),
              publishedAt: postState.post.publishedAt.toISOString().slice(0, 10),
            }}
            currentImage={postState.post.image.toString()}
            currentGallery={postState.post.gallery.toArray()}
            slugEditable={false}
            submitLabel="Desa els canvis"
            submittingLabel="Desant..."
          />
        </div>
      )}
    </section>
  )
}
