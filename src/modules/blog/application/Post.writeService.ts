import type { CreatePostCommand } from './command/CreatePost.command'
import type { CreatePostCommandHandler } from './command/CreatePost.commandHandler'
import type { DeletePostCommand } from './command/DeletePost.command'
import type { DeletePostCommandHandler } from './command/DeletePost.commandHandler'
import type { UpdatePostCommand } from './command/UpdatePost.command'
import type { UpdatePostCommandHandler } from './command/UpdatePost.commandHandler'

export abstract class PostWriteService {
  abstract createPost(command: CreatePostCommand): Promise<void>
  abstract updatePost(command: UpdatePostCommand): Promise<void>
  abstract deletePost(command: DeletePostCommand): Promise<void>
}

export class PostWriteServiceImpl extends PostWriteService {
  constructor(
    private readonly createPostHandler: CreatePostCommandHandler,
    private readonly updatePostHandler: UpdatePostCommandHandler,
    private readonly deletePostHandler: DeletePostCommandHandler,
  ) {
    super()
  }

  createPost(command: CreatePostCommand): Promise<void> {
    return this.createPostHandler.handle(command)
  }

  updatePost(command: UpdatePostCommand): Promise<void> {
    return this.updatePostHandler.handle(command)
  }

  deletePost(command: DeletePostCommand): Promise<void> {
    return this.deletePostHandler.handle(command)
  }
}
