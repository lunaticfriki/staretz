import { useEffect, useMemo } from 'preact/hooks';
import { container } from '../../../di/container';
import { TYPES } from '../../../di/types';
import { PostStateService } from '../application/state.service';
import { Link } from '../../../ui/link.component';
import { TagsViewModel } from './viewModels/tags.viewModel';

export default function TagsPage() {
  const service = useMemo(() => container.get<PostStateService>(TYPES.PostStateService), []);
  const viewModel = useMemo(() => new TagsViewModel(service), [service]);

  useEffect(() => {
    viewModel.loadPosts();
  }, [viewModel]);

  if (viewModel.isLoading) {
    return (
      <div class="flex justify-center p-10">
        <span class="text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div class="container mx-auto px-4 py-8">
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

      <h1 class="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">Totes les etiquetes</h1>

      <div class="flex flex-wrap gap-4">
        {viewModel.tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/blog/tags/${tag.id}`}
            class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:shadow-md transition-shadow"
          >
            <span class="font-medium text-zinc-700 dark:text-zinc-300">#{tag.name}</span>
            <span class="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">
              {tag.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
