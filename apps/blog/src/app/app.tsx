import { useEffect } from 'react';
import { PostDI } from './di.config';
import { seedPosts } from './infrastructure/seed/post.seed';
import { useSignals } from '@preact/signals-react/runtime';
import { PostsContainer } from './ui/containers/posts.container';
import { usePostRead } from './application/hooks/usePostRead';

export function App() {
  useSignals();
  const { posts, loading, error, loadPosts } = usePostRead();
  const { repository } = PostDI;

  useEffect(() => {
    const init = async () => {
      await seedPosts(repository);
      await loadPosts();
    };
    init();
  }, []);

  return (
    <div>
      <h1>BLOG</h1>
      {loading.value && <p>Loading...</p>}
      {error.value && <p>{error.value}</p>}
      <PostsContainer posts={posts.value} />
    </div>
  );
}

export default App;
