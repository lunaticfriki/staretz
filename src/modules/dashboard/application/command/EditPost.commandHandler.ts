import { UpdatePostCommand } from '../../../blog/application/command/UpdatePost.command'
import type { PostWriteService } from '../../../blog/application/Post.writeService'
import type { PostImageUploader } from '../../domain/repositories/PostImageUploader.repository'
import { EditPostCommand } from './EditPost.command'
import { resolveGalleryPlaceholders } from './resolveGalleryPlaceholders.util'

export class EditPostCommandHandler {
  constructor(
    private readonly imageUploader: PostImageUploader,
    private readonly postWriteService: PostWriteService,
  ) {}

  async handle(command: EditPostCommand): Promise<void> {
    const image = command.imageFile ? await this.imageUploader.upload(command.imageFile) : command.currentImage
    const uploadedGalleryUrls = await this.imageUploader.uploadMany(command.newGalleryFiles)
    const gallery = [...command.keptGalleryUrls, ...uploadedGalleryUrls]
    const content = resolveGalleryPlaceholders(command.content, uploadedGalleryUrls)

    await this.postWriteService.updatePost(
      new UpdatePostCommand(
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
