import { useEffect, useMemo } from 'preact/hooks';
import { container } from '../../../di/container';
import { TYPES } from '../../../di/types';
import { PostStateService } from '../application/state.service';
import { PostPreview } from './postPreview.component';
import { Link } from '../../../ui/link.component';
import { TagViewModel } from './viewModels/tag.viewModel';

interface TagPageProps {
  tag: string;
}

export default function TagPage({ tag }: TagPageProps) {
  const service = useMemo(() => container.get<PostStateService>(TYPES.PostStateService), []);
  const viewModel = useMemo(() => new TagViewModel(service, tag), [service, tag]);

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

      <h1 class="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">
        Articles amb l'etiqueta{' '}
        <span class="text-fuchsia-600 dark:text-fuchsia-400">#{viewModel.tagName}</span>
      </h1>

      {!viewModel.hasPosts ? (
        <div class="text-center py-10">
          <p class="text-xl text-zinc-500">No s'han trobat articles amb aquesta etiqueta.</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {viewModel.posts.map((post) => (
            <PostPreview key={post.id} viewModel={post} />
          ))}
        </div>
      )}
    </div>
  );
}
