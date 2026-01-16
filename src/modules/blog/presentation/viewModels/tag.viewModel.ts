import { PostStateService } from '../../application/state.service';
import { PostPreviewViewModel } from './postPreview.viewModel';
import { Post } from '../../domain/entities/post';

export class TagViewModel {
  constructor(
    private readonly service: PostStateService,
    private readonly tag: string,
  ) {}

  get isLoading() {
    return this.service.isLoading.value;
  }

  get tagName() {
    return this.tag;
  }

  get posts() {
    return this.service.posts.value
      .filter((post: Post) => post.tags.includes(this.tag))
      .map((post: Post) => new PostPreviewViewModel(post));
  }

  get hasPosts() {
    return this.posts.length > 0;
  }

  loadPosts() {
    this.service.loadPosts();
  }
}
