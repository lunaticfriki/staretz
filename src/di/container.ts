import { Container } from 'inversify';
import { TYPES } from './types';
import { PostRepository } from '../modules/blog/domain/repositories/post.repository';

import { MarkdownPostRepository } from '../modules/blog/infrastructure/markdownPost.repository';
import { PostReadService } from '../modules/blog/application/read.service';
import { PostWriteService } from '../modules/blog/application/write.service';
import { PostStateService } from '../modules/blog/application/state.service';

const container = new Container({ defaultScope: 'Singleton' });

container.bind<PostRepository>(TYPES.PostRepository).to(MarkdownPostRepository);
container.bind<PostReadService>(TYPES.PostReadService).to(PostReadService);
container.bind<PostWriteService>(TYPES.PostWriteService).to(PostWriteService);
container.bind<PostStateService>(TYPES.PostStateService).to(PostStateService);

export { container };
