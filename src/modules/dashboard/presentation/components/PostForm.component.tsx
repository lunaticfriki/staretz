import { useState } from 'preact/hooks'
import { useCategoriesState } from '../../../blog/presentation/useCategoriesState.hook'

export interface PostFormValues {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  publishedAt: string
  imageFile: File | null
}

interface PostFormProps {
  onSubmit: (values: PostFormValues) => void
  submitting: boolean
  initialValues?: Omit<PostFormValues, 'imageFile'>
  currentImage?: string
  slugEditable?: boolean
  submitLabel?: string
  submittingLabel?: string
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const fieldClass =
  'rounded border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-purple-500 focus:outline-none dark:border-gray-700'

export function PostForm({
  onSubmit,
  submitting,
  initialValues,
  currentImage,
  slugEditable = true,
  submitLabel = 'Publica',
  submittingLabel = 'Publicant...',
}: PostFormProps) {
  const categoriesState = useCategoriesState()
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [slug, setSlug] = useState(initialValues?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues))
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? '')
  const [content, setContent] = useState(initialValues?.content ?? '')
  const [author, setAuthor] = useState(initialValues?.author ?? '')
  const [category, setCategory] = useState(initialValues?.category ?? '')
  const [publishedAt, setPublishedAt] = useState(
    () => initialValues?.publishedAt ?? new Date().toISOString().slice(0, 10),
  )
  const [imageFile, setImageFile] = useState<File | null>(null)

  function handleTitleInput(value: string) {
    setTitle(value)
    if (!slugTouched) {
      setSlug(slugify(value))
    }
  }

  function handleSubmit(event: Event) {
    event.preventDefault()
    onSubmit({ slug, title, excerpt, content, author, category, publishedAt, imageFile })
  }

  return (
    <form onSubmit={handleSubmit} class="mt-6 flex flex-col gap-4">
      <label class="flex flex-col gap-1 text-sm">
        Títol
        <input
          type="text"
          required
          value={title}
          onInput={(event) => handleTitleInput((event.target as HTMLInputElement).value)}
          class={fieldClass}
        />
      </label>
      <label class="flex flex-col gap-1 text-sm">
        Slug
        <input
          type="text"
          required
          disabled={!slugEditable}
          value={slug}
          onInput={(event) => {
            setSlugTouched(true)
            setSlug((event.target as HTMLInputElement).value)
          }}
          class={`${fieldClass} font-mono disabled:cursor-not-allowed disabled:opacity-60`}
        />
      </label>
      <label class="flex flex-col gap-1 text-sm">
        Extracte
        <textarea
          required
          rows={2}
          value={excerpt}
          onInput={(event) => setExcerpt((event.target as HTMLTextAreaElement).value)}
          class={fieldClass}
        />
      </label>
      <label class="flex flex-col gap-1 text-sm">
        Contingut (Markdown)
        <textarea
          required
          rows={12}
          value={content}
          onInput={(event) => setContent((event.target as HTMLTextAreaElement).value)}
          class={`${fieldClass} font-mono`}
        />
      </label>
      <div class="grid grid-cols-2 gap-4">
        <label class="flex flex-col gap-1 text-sm">
          Autor
          <input
            type="text"
            required
            value={author}
            onInput={(event) => setAuthor((event.target as HTMLInputElement).value)}
            class={fieldClass}
          />
        </label>
        <label class="flex flex-col gap-1 text-sm">
          Categoria
          <input
            type="text"
            required
            list="dashboard-categories"
            value={category}
            onInput={(event) => setCategory((event.target as HTMLInputElement).value)}
            class={fieldClass}
          />
          {categoriesState.status === 'loaded' && (
            <datalist id="dashboard-categories">
              {categoriesState.categories.toArray().map((existingCategory) => (
                <option key={existingCategory.toString()} value={existingCategory.toString()} />
              ))}
            </datalist>
          )}
        </label>
      </div>
      <label class="flex flex-col gap-1 text-sm">
        Data de publicació
        <input
          type="date"
          required
          value={publishedAt}
          onInput={(event) => setPublishedAt((event.target as HTMLInputElement).value)}
          class={fieldClass}
        />
      </label>
      <label class="flex flex-col gap-1 text-sm">
        Imatge
        {currentImage && (
          <div class="mb-1 flex items-center gap-3">
            <img src={currentImage} alt="" class="h-16 w-24 rounded object-cover" />
            <span class="text-xs text-gray-500 dark:text-gray-400">
              Imatge actual — deixa-ho en blanc per mantenir-la
            </span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          required={!currentImage}
          onInput={(event) => setImageFile((event.target as HTMLInputElement).files?.[0] ?? null)}
          class="text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        class="rounded bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800 disabled:opacity-50 dark:bg-purple-400 dark:text-black"
      >
        {submitting ? submittingLabel : submitLabel}
      </button>
    </form>
  )
}
