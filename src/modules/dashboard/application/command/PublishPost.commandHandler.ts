import { CreatePostCommand } from '../../../blog/application/command/CreatePost.command'
import type { PostWriteService } from '../../../blog/application/Post.writeService'
import { MissingPostImageError } from '../../domain/errors/MissingPostImage.error'
import type { PostImageUploader } from '../../domain/repositories/PostImageUploader.repository'
import { PublishPostCommand } from './PublishPost.command'
import { resolveGalleryPlaceholders } from './resolveGalleryPlaceholders.util'

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
    const gallery = await this.imageUploader.uploadMany(command.galleryFiles)
    const content = resolveGalleryPlaceholders(command.content, gallery)

    await this.postWriteService.createPost(
      new CreatePostCommand(
        command.slug,
        command.title,
        command.excerpt,
        content,
        command.author,
        command.category,
        command.publishedAt,
        image,
        gallery,
      ),
    )
  }
}
