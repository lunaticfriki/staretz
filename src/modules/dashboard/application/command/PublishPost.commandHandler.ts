import { CreatePostCommand } from '../../../blog/application/command/CreatePost.command'
import type { PostWriteService } from '../../../blog/application/Post.writeService'
import { MissingPostImageError } from '../../domain/errors/MissingPostImage.error'
import type { PostImageUploader } from '../../domain/repositories/PostImageUploader.repository'
import { PublishPostCommand } from './PublishPost.command'

export class PublishPostCommandHandler {
  constructor(
    private readonly imageUploader: PostImageUploader,
    private readonly postWriteService: PostWriteService,
  ) {}

  async handle(command: PublishPostCommand): Promise<void> {
    if (!command.imageFile) {
      throw new MissingPostImageError()
    }

    const image = await this.imageUploader.upload(command.imageFile)

    await this.postWriteService.createPost(
      new CreatePostCommand(
        command.slug,
        command.title,
        command.excerpt,
        command.content,
        command.author,
        command.category,
        command.publishedAt,
        image,
      ),
    )
  }
}
