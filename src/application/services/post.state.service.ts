import 'reflect-metadata';
import { injectable } from 'inversify';
import type { Post } from '../../domain/entities/post';

@injectable()
export class PostStateService {
    private posts: Post[] = [];

    getPosts(): Post[] {
        return this.posts;
    }

    getPostsByCategory(category: string): Post[] {
        return this.posts.filter(
            (post) => post.category.getValue() === category,
        );
    }

    setPosts(posts: Post[]): void {
        this.posts = posts;
    }
}
