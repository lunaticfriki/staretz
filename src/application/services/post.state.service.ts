import 'reflect-metadata';
import { injectable } from 'inversify';
import type { Post } from '../../domain/entities/post';

@injectable()
export class PostStateService {
    private posts: Post[] = [];

    getPosts(): Post[] {
        return this.posts;
    }

    setPosts(posts: Post[]): void {
        this.posts = posts;
    }
}
