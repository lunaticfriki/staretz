import { PostDI } from '../../di.config';
import { Post } from '../../domain/entities/post';

export function usePostWrite() {
  const createPost = async (post: Post) => {
    await PostDI.repository.save(post);
  };

  return {
    createPost,
  };
}
