import { Post } from '../../domain/entities/post';

export class PostPreviewViewModel {
  constructor(private readonly post: Post) {}

  get id() {
    return this.post.id;
  }

  get title() {
    return this.post.title;
  }

  get excerpt() {
    return this.post.content.length > 100
      ? this.post.content.substring(0, 50) + '...'
      : this.post.content;
  }

  get image() {
    return this.post.image;
  }

  get date() {
    return this.post.createdAt.toLocaleDateString();
  }

  get authorName() {
    return this.post.author.name;
  }

  get authorAvatar() {
    return this.post.author.avatar;
  }

  get tags() {
    return this.post.tags;
  }

  get topic() {
    const rawTopic = this.post.topic;
    // Ensure capitalization for display consistency if needed, or just return raw
    return rawTopic.charAt(0).toUpperCase() + rawTopic.slice(1);
  }
}
