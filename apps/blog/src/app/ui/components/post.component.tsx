import { Post } from '../../domain/entities/post';

export const PostComponent = ({ post }: { post: Post }) => {
  return (
    <li key={post.getValue().id}>
      <h2>{post.getValue().title.getValue()}</h2>
      <p>{post.getValue().content.getValue()}</p>
    </li>
  );
};
