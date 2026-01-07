import { Post } from '@blog/domain/entities/post';

export class PostDetailViewModel {
  constructor(private readonly post: Post | null) {}

  get hasPost() {
    return this.post !== null;
  }

  get id() {
    return this.post?.id || '';
  }

  get title() {
    return this.post?.title || '';
  }

  get content() {
    return this.post?.content || '';
  }

  get image() {
    return this.post?.image || '';
  }

  get date() {
    return this.post?.createdAt.toLocaleDateString() || '';
  }

  get authorName() {
    return this.post?.author.name || '';
  }

  get authorAvatar() {
    return this.post?.author.avatar || '';
  }

  get authorEmail() {
    return this.post?.author.email || '';
  }
}
