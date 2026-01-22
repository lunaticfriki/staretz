import { Post } from '../../modules/blog/domain/entities/post';
import { PostStateService } from '../../modules/blog/application/state.service';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../di/types';

@injectable()
export class HomeViewModel {
  constructor(@inject(TYPES.PostStateService) private readonly stateService: PostStateService) {
    this.stateService.loadPosts();
  }

  get posts() {
    return this.stateService.posts;
  }

  get loading() {
    return this.stateService.isLoading;
  }

  get error() {
    return this.stateService.error;
  }

  getLatestPosts(section: string, limit: number = 3): Post[] {
    const allPosts = this.stateService.posts.value;
    const filtered = allPosts
      .filter((post) => {
        const postSection = post.section ? post.section.toLowerCase() : 'undefined';
        const targetSection = section.toLowerCase();
        return postSection === targetSection;
      })
      .slice(0, limit);
    return filtered;
  }
}
