import 'reflect-metadata';
import { Container } from 'inversify';
import { POST_TYPES } from './post.types';
import type { PostDatasource } from '../../domain/datasources/post.datasource';
import type { PostRepository } from '../../domain/repositories/post.repository';
import { SeedPostDatasource } from '../../infrastructure/datasources/seed.post.datasource';
import { PostRepositoryImpl } from '../../infrastructure/repositories/post.repository.impl';
import { PostStateService } from '../services/post.state.service';
import { PostReadService } from '../services/post.read.service';

const container = new Container();

container
    .bind<PostDatasource>(POST_TYPES.PostDatasource)
    .to(SeedPostDatasource)
    .inSingletonScope();
container
    .bind<PostRepository>(POST_TYPES.PostRepository)
    .to(PostRepositoryImpl)
    .inSingletonScope();
container
    .bind<PostStateService>(POST_TYPES.PostStateService)
    .to(PostStateService)
    .inSingletonScope();
container
    .bind<PostReadService>(POST_TYPES.PostReadService)
    .to(PostReadService)
    .inSingletonScope();

export const postDI = {
    get postStateService() {
        return container.get<PostStateService>(POST_TYPES.PostStateService);
    },
    get postReadService() {
        return container.get<PostReadService>(POST_TYPES.PostReadService);
    },
};
