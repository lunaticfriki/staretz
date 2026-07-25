import { UpdatePostCommand } from '../../../blog/application/command/UpdatePost.command'
import type { PostWriteService } from '../../../blog/application/Post.writeService'
import type { PostImageUploader } from '../../domain/repositories/PostImageUploader.repository'
import { EditPostCommand } from './EditPost.command'

export class EditPostCommandHandler {
  constructor(
    private readonly imageUploader: PostImageUploader,
    private readonly postWriteService: PostWriteService,
  ) {}

  async handle(command: EditPostCommand): Promise<void> {
    const image = command.imageFile ? await this.imageUploader.upload(command.imageFile) : command.currentImage

    await this.postWriteService.updatePost(
      new UpdatePostCommand(
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
