import { container } from '../../../composition-root'
import type { PublishPostCommand } from '../application/command/PublishPost.command'
import type { PublishPostState, PublishPostStateService } from '../application/PublishPost.stateService'
import { TYPES } from '../../../shared/di/types'

interface PublishPostStateResult {
  publish: PublishPostState
  publishPost: (command: PublishPostCommand) => Promise<void>
}

export function usePublishPostState(): PublishPostStateResult {
  const publishPostStateService = container.get<PublishPostStateService>(TYPES.PublishPostStateService)

  return {
    publish: publishPostStateService.state.value,
    publishPost: (command) => publishPostStateService.publish(command),
  }
}
