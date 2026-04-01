import { signal, Signal } from '@preact/signals-core';
import { Post } from '../../domain/entities/Post';

export class PostStateService {
    private readonly _posts: Signal<Post[]>;

    private constructor() {
        this._posts = signal<Post[]>([]);
    }

    public static create(): PostStateService {
        return new PostStateService();
    }

    public get posts(): Post[] {
        return this._posts.value;
    }

    public setPosts(posts: Post[]): void {
        this._posts.value = posts;
    }
}
