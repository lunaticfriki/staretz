import { useMemo } from 'preact/hooks';
import { container } from '../di/container';
import { TYPES } from '../di/types';
import { HomeViewModel } from './viewModels/home.viewModel';
import { PostPreview } from '../modules/blog/presentation/postPreview.component';
import { PostPreviewViewModel } from '../modules/blog/presentation/viewModels/postPreview.viewModel';

export function HomePage() {
  const viewModel = useMemo(() => container.get<HomeViewModel>(TYPES.HomeViewModel), []);

  const renderSection = (title: string, sectionKey: string) => {
    const posts = viewModel.getLatestPosts(sectionKey);
    return (
      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-zinc-900 dark:text-white capitalize">{title}</h2>
        {posts.length > 0 ? (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostPreview key={post.id} viewModel={new PostPreviewViewModel(post)} />
            ))}
          </div>
        ) : (
          <div class="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
            <p class="text-xl text-zinc-500 dark:text-zinc-400 italic">
              Stay tuned... coming soon!
            </p>
          </div>
        )}
      </section>
    );
  };

  if (viewModel.loading.value) {
    return (
      <div class="flex justify-center p-10">
        <span class="text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div class="container mx-auto px-4 py-8">
      {renderSection('Latest from Blog', 'blog')}
      {renderSection('Music', 'music')}
      {renderSection('Programming', 'programming')}
    </div>
  );
}
