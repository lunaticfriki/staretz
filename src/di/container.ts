import { Container } from 'inversify';
import { TYPES } from './types';
import { PostRepository } from '../modules/blog/domain/repositories/post.repository';

import { MarkdownPostRepository } from '../modules/blog/infrastructure/markdownPost.repository';
import { PostReadService } from '../modules/blog/application/read.service';
import { PostWriteService } from '../modules/blog/application/write.service';
import { PostStateService } from '../modules/blog/application/state.service';
import { ReactMarkdownAdapter } from '../modules/textEditor/infrastructure/reactMarkdown.adapter';
import type { TextEditorComponent } from '../modules/textEditor/application/textEditor.contract';

const container = new Container({ defaultScope: 'Singleton' });

container.bind<PostRepository>(TYPES.PostRepository).to(MarkdownPostRepository);
container.bind<PostReadService>(TYPES.PostReadService).to(PostReadService);
container.bind<PostWriteService>(TYPES.PostWriteService).to(PostWriteService);
container.bind<PostStateService>(TYPES.PostStateService).to(PostStateService);
container.bind<TextEditorComponent>(TYPES.TextEditor).toConstantValue(ReactMarkdownAdapter);

export { container };
