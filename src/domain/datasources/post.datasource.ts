import type { Post } from '../entities/post';

export interface PostDatasource {
    getPosts(): Promise<Post[]>;
}
