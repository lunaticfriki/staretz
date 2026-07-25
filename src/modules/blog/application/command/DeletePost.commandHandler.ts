import { Slug } from '../../domain/value-objects/Slug.valueObject'
import type { PostRepository } from '../../domain/repositories/Post.repository'
import { DeletePostCommand } from './DeletePost.command'

export class DeletePostCommandHandler {
  constructor(private readonly posts: PostRepository) {}

  async handle(command: DeletePostCommand): Promise<void> {
    await this.posts.delete(Slug.create(command.slug))
  }
}
