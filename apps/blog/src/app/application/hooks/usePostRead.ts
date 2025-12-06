import { useSignal } from '@preact/signals-react';
import { PostDI } from '../../di.config';
import { Post } from '../../domain/entities/post';

export function usePostRead() {
  const posts = useSignal<Post[]>([]);
  const loading = useSignal<boolean>(false);
  const error = useSignal<string | null>(null);

  const loadPosts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const result = await PostDI.repository.findAll();
      posts.value = result;
    } catch (e) {
      error.value = 'Failed to load posts';
    } finally {
      loading.value = false;
    }
  };

  return {
    posts,
    loading,
    error,
    loadPosts,
  };
}
