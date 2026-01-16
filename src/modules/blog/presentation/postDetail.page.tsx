import { useEffect, useMemo } from 'preact/hooks';
import { container } from '../../../di/container';
import { TYPES } from '../../../di/types';
import { PostStateService } from '../application/state.service';
import { PostDetailViewModel } from './viewModels/postDetail.viewModel';
import { Link } from '../../../ui/link.component';
import type { TextEditorComponent } from '../../textEditor/application/textEditor.contract';

interface PostDetailProps {
  id: string;
}

export default function PostDetailPage({ id }: PostDetailProps) {
  const service = useMemo(() => container.get<PostStateService>(TYPES.PostStateService), []);
  const TextEditor = useMemo(() => container.get<TextEditorComponent>(TYPES.TextEditor), []);

  useEffect(() => {
    service.loadPost(id);
  }, [id, service]);

  if (service.isLoading.value) {
    return (
      <div class="flex justify-center p-10">
        <span class="text-xl">Loading...</span>
      </div>
    );
  }

  if (service.error.value) {
    return <div class="text-red-500 p-10 text-center">{service.error.value}</div>;
  }

  const viewModel = new PostDetailViewModel(service.currentPost.value);

  if (!viewModel.hasPost) {
    return <div class="p-10 text-center">Post not found</div>;
  }

  return (
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/blog"
        class="inline-flex items-center text-zinc-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 mb-8 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Tornar al Blog
      </Link>

      <article>
        <div class="relative h-96 rounded-2xl overflow-hidden mb-10 shadow-xl">
          <img src={viewModel.image} alt={viewModel.title} class="w-full h-full object-cover" />
        </div>

        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white leading-tight">
          {viewModel.title}
        </h1>

        <div class="mb-6 flex flex-wrap gap-2">
          <Link
            href={`/blog/topics/${viewModel.topic}`}
            class="inline-block px-3 py-1 text-sm font-semibold tracking-wide text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-full hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30 transition-colors"
          >
            {viewModel.topic}
          </Link>
          {viewModel.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tags/${tag}`}
              class="inline-block px-3 py-1 text-sm font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <div class="flex items-center gap-4 mb-10 pb-10 border-b border-zinc-200 dark:border-zinc-800">
          <img
            src={viewModel.authorAvatar}
            alt={viewModel.authorName}
            class="w-12 h-12 rounded-full ring-2 ring-white dark:ring-zinc-900"
          />
          <div>
            <div class="font-medium text-gray-900 dark:text-white">{viewModel.authorName}</div>
            <div class="text-sm text-gray-600 dark:text-zinc-400">{viewModel.date}</div>
          </div>
        </div>

        <div class="prose dark:prose-invert max-w-none text-lg leading-relaxed text-zinc-950 dark:text-zinc-300 prose-a:text-fuchsia-700 dark:prose-a:text-fuchsia-400 prose-headings:text-black dark:prose-headings:text-white">
          <TextEditor content={viewModel.content} />
        </div>
      </article>
    </div>
  );
}
