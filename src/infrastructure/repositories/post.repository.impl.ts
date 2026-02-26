import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import type { Post } from '../../domain/entities/post';
import type { PostDatasource } from '../../domain/datasources/post.datasource';
import type { PostRepository } from '../../domain/repositories/post.repository';
import { POST_TYPES } from '../../application/di/post.types';

@injectable()
export class PostRepositoryImpl implements PostRepository {
    constructor(
        @inject(POST_TYPES.PostDatasource)
        private readonly datasource: PostDatasource,
    ) {}

    async getPosts(): Promise<Post[]> {
        return this.datasource.getPosts();
    }
}
