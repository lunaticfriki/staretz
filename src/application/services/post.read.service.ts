import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import type { PostRepository } from '../../domain/repositories/post.repository';
import { PostStateService } from './post.state.service';
import { POST_TYPES } from '../di/post.types';

@injectable()
export class PostReadService {
    constructor(
        @inject(POST_TYPES.PostRepository)
        private readonly repository: PostRepository,
        @inject(POST_TYPES.PostStateService)
        private readonly stateService: PostStateService,
    ) {}

    async execute(): Promise<void> {
        const posts = await this.repository.getPosts();
        this.stateService.setPosts(posts);
    }
}
