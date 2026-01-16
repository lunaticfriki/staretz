import { PostStateService } from '../../application/state.service';
import { PostPreviewViewModel } from './postPreview.viewModel';
import { Post } from '../../domain/entities/post';

export class TopicViewModel {
  constructor(
    private readonly service: PostStateService,
    private readonly topic: string,
  ) {}

  get isLoading() {
    return this.service.isLoading.value;
  }

  get topicName() {
    return this.topic;
  }

  get posts() {
    return this.service.posts.value
      .filter((post: Post) => post.topic === this.topic)
      .map((post: Post) => new PostPreviewViewModel(post));
  }

  get hasPosts() {
    return this.posts.length > 0;
  }

  loadPosts() {
    this.service.loadPosts();
  }
}
