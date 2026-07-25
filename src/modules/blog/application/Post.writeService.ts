import type { CreatePostCommand } from './command/CreatePost.command'
import type { CreatePostCommandHandler } from './command/CreatePost.commandHandler'

export abstract class PostWriteService {
  abstract createPost(command: CreatePostCommand): Promise<void>
}

export class PostWriteServiceImpl extends PostWriteService {
  constructor(private readonly createPostHandler: CreatePostCommandHandler) {
    super()
  }

  createPost(command: CreatePostCommand): Promise<void> {
    return this.createPostHandler.handle(command)
  }
}
