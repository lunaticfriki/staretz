import 'reflect-metadata';
import { Container } from 'inversify';
import type { PostRepository } from './domain/repositories/post.repository';
import { InMemoryPostRepository } from './infrastructure/repositories/in-memory.post.repository';
import { PostReadService } from './application/services/post.read.service';
import { PostWriteService } from './application/services/post.write.service';

const container = new Container();

container
  .bind<PostRepository>('PostRepository')
  .to(InMemoryPostRepository)
  .inSingletonScope();
container.bind<PostReadService>(PostReadService).toSelf();
container.bind<PostWriteService>(PostWriteService).toSelf();

export { container };
