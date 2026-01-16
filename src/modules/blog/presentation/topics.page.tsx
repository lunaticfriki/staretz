import { useEffect, useMemo } from 'preact/hooks';
import { container } from '../../../di/container';
import { TYPES } from '../../../di/types';
import { PostStateService } from '../application/state.service';
import { Link } from '../../../ui/link.component';
import { TopicsViewModel } from './viewModels/topics.viewModel';

export default function TopicsPage() {
  const service = useMemo(() => container.get<PostStateService>(TYPES.PostStateService), []);
  const viewModel = useMemo(() => new TopicsViewModel(service), [service]);

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

      <h1 class="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">Tots els temes</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {viewModel.topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/blog/topics/${topic.id.toLowerCase()}`}
            class="block p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-lg transition-all group"
          >
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                {topic.name}
              </h2>
              <span class="text-sm bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 px-3 py-1 rounded-full">
                {topic.count} articles
              </span>
            </div>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm">
              Veure tots els articles de {topic.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
