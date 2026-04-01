import { AstroContentPostRepositoryAdapter } from '../infrastructure/adapters/AstroContentPostRepositoryAdapter';
import { PostReadService } from '../application/services/PostReadService';
import { PostStateService } from '../application/services/PostStateService';
import { PostRepositoryPort } from '../application/ports/PostRepositoryPort';

export class DependencyLocator {
    private static postRepository?: PostRepositoryPort;
    private static postReadService?: PostReadService;
    private static postStateService?: PostStateService;

    private static getPostRepository(): PostRepositoryPort {
        if (!this.postRepository) {
            this.postRepository = AstroContentPostRepositoryAdapter.create();
        }
        return this.postRepository;
    }

    public static getPostReadService(): PostReadService {
        if (!this.postReadService) {
            this.postReadService = PostReadService.create(this.getPostRepository());
        }
        return this.postReadService;
    }

    public static getPostStateService(): PostStateService {
        if (!this.postStateService) {
            this.postStateService = PostStateService.create();
        }
        return this.postStateService;
    }
}
