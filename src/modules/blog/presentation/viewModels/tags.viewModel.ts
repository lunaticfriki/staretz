import { PostStateService } from '../../application/state.service';
import { Post } from '../../domain/entities/post';

export class TagsViewModel {
  constructor(private readonly service: PostStateService) {}

  get isLoading() {
    return this.service.isLoading.value;
  }

  get tags() {
    const counts: Record<string, number> = {};
    this.service.posts.value.forEach((post: Post) => {
      post.tags.forEach((tag: string) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    return Object.keys(counts)
      .sort()
      .map((tag) => ({
        id: tag,
        name: tag,
        count: counts[tag],
      }));
  }

  loadPosts() {
    this.service.loadPosts();
  }
}
