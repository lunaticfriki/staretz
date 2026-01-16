import { PostStateService } from '../../application/state.service';
import { Post } from '../../domain/entities/post';

export class TopicsViewModel {
  constructor(private readonly service: PostStateService) {}

  get isLoading() {
    return this.service.isLoading.value;
  }

  get topics() {
    const counts: Record<string, number> = {};
    this.service.posts.value.forEach((post: Post) => {
      const topic = post.topic; // Keep raw topic key
      counts[topic] = (counts[topic] || 0) + 1;
    });

    return Object.keys(counts)
      .sort()
      .map((topic) => ({
        id: topic,
        name: topic,
        count: counts[topic],
      }));
  }

  loadPosts() {
    this.service.loadPosts();
  }
}
