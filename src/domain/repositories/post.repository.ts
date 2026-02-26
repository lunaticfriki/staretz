import type { Post } from '../entities/post';

export interface PostRepository {
    getPosts(): Promise<Post[]>;
}
