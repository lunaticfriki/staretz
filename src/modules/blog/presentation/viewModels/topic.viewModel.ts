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
    const matchingPost = this.service.posts.value.find(
      (post: Post) => post.topic.toLowerCase() === this.topic.toLowerCase(),
    );
    return matchingPost ? matchingPost.topic : this.topic;
  }

  get posts() {
    return this.service.posts.value
      .filter((post: Post) => post.topic.toLowerCase() === this.topic.toLowerCase())
      .map((post: Post) => new PostPreviewViewModel(post));
  }

  get hasPosts() {
    return this.posts.length > 0;
  }

  loadPosts() {
    this.service.loadPosts();
  }
}
