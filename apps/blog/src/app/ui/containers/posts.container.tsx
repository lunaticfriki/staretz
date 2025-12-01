import { Post } from '../../domain/entities/post';
import { PostComponent } from '../components/post.component';

export const PostsContainer = ({ posts }: { posts: Post[] }) => {
  return (
    <ul>
      {posts.map((post) => (
        <PostComponent post={post} />
      ))}
    </ul>
  );
};
