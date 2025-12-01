import { useEffect } from 'react';
import { container } from './di.config';
import { PostReadService } from './application/services/post.read.service';
import { seedPosts } from './infrastructure/seed/post.seed';
import type { PostRepository } from './domain/repositories/post.repository';
import { useSignals } from '@preact/signals-react/runtime';
import { PostsContainer } from './ui/containers/posts.container';

export function App() {
  useSignals();
  const readService = container.get(PostReadService);
  const repository = container.get<PostRepository>('PostRepository');

  useEffect(() => {
    const init = async () => {
      await seedPosts(repository);
      await readService.loadPosts();
    };
    init();
  }, [readService, repository]);

  return (
    <div>
      <h1>BLOG</h1>
      {readService.loading.value && <p>Loading...</p>}
      {readService.error.value && <p>{readService.error.value}</p>}
      <PostsContainer posts={readService.posts.value} />
    </div>
  );
}

export default App;
