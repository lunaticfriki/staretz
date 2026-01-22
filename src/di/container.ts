import { Container } from 'inversify';
import { TYPES } from './types';
import { PostRepository } from '../modules/blog/domain/repositories/post.repository';
import { HomeViewModel } from '../ui/viewModels/home.viewModel';
import { ErrorViewModel } from '../ui/viewModels/error.viewModel';

import { ContentfulPostRepository } from '../modules/blog/infrastructure/repositories/contentful-post.repository';
import { PostReadService } from '../modules/blog/application/read.service';
import { PostWriteService } from '../modules/blog/application/write.service';
import { PostStateService } from '../modules/blog/application/state.service';
import { ReactMarkdownAdapter } from '../modules/textEditor/infrastructure/reactMarkdown.adapter';
import type { TextEditorComponent } from '../modules/textEditor/application/textEditor.contract';
import { AppErrorHandler } from '../modules/shared/infrastructure/appErrorHandler';
import { ErrorHandler } from '../modules/shared/domain/ports/errorHandler.port';

import { EnvContentfulConfig } from '../modules/blog/infrastructure/config/env-contentful.config';
import type { ContentfulConfig } from '../modules/blog/domain/ports/contentful.config';

const container = new Container({ defaultScope: 'Singleton' });

container.bind<PostRepository>(TYPES.PostRepository).to(ContentfulPostRepository);
container.bind<PostReadService>(TYPES.PostReadService).to(PostReadService);
container.bind<PostWriteService>(TYPES.PostWriteService).to(PostWriteService);
container.bind<PostStateService>(TYPES.PostStateService).to(PostStateService);
container.bind<TextEditorComponent>(TYPES.TextEditor).toConstantValue(ReactMarkdownAdapter);
container.bind<HomeViewModel>(TYPES.HomeViewModel).to(HomeViewModel);
container.bind<ErrorViewModel>(TYPES.ErrorViewModel).to(ErrorViewModel);
container.bind<ErrorHandler>(TYPES.ErrorHandler).to(AppErrorHandler);

container.bind<ContentfulConfig>(TYPES.ContentfulConfig).to(EnvContentfulConfig);

export { container };
