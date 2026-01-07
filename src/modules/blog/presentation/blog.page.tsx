import { useEffect, useMemo } from 'preact/hooks';
import { container } from '../../../di/container';
import { TYPES } from '../../../di/types';
import { PostStateService } from '../application/state.service';
import { PostPreview } from './postPreview.component';
import { PostPreviewViewModel } from './viewModels/postPreview.viewModel';

export default function BlogPage() {
  const service = useMemo(() => container.get<PostStateService>(TYPES.PostStateService), []);

  useEffect(() => {
    service.loadPosts();
  }, [service]);

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

  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8 text-zinc-900 dark:text-white">Blog</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {service.posts.value.map((post) => (
          <PostPreview key={post.id} viewModel={new PostPreviewViewModel(post)} />
        ))}
      </div>
    </div>
  );
}
