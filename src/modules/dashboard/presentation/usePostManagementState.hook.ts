import { container } from '../../../composition-root'
import type { EditPostCommand } from '../application/command/EditPost.command'
import type { PublishPostCommand } from '../application/command/PublishPost.command'
import type {
  DeletePostState,
  EditPostState,
  PostManagementStateService,
  PublishPostState,
} from '../application/PostManagement.stateService'
import { TYPES } from '../../../shared/di/types'

interface PostManagementStateResult {
  publish: PublishPostState
  edit: EditPostState
  delete: DeletePostState
  publishPost: (command: PublishPostCommand) => Promise<void>
  editPost: (command: EditPostCommand) => Promise<void>
  deletePost: (slug: string) => Promise<void>
}

export function usePostManagementState(): PostManagementStateResult {
  const postManagementStateService = container.get<PostManagementStateService>(TYPES.PostManagementStateService)

  return {
    publish: postManagementStateService.publish.value,
    edit: postManagementStateService.edit.value,
    delete: postManagementStateService.delete.value,
    publishPost: (command) => postManagementStateService.publishPost(command),
    editPost: (command) => postManagementStateService.editPost(command),
    deletePost: (slug) => postManagementStateService.deletePost(slug),
  }
}
