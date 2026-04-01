import { PostRepositoryPort } from '../ports/PostRepositoryPort';
import { Post } from '../../domain/entities/Post';
import { PostId } from '../../domain/valueObjects/PostId';

export class PostReadService {
    private constructor(private readonly repository: PostRepositoryPort) {}

    public static create(repository: PostRepositoryPort): PostReadService {
        return new PostReadService(repository);
    }

    public async getAllPosts(): Promise<Post[]> {
        return this.repository.getAllPosts();
    }

    public async getPostById(id: string): Promise<Post | undefined> {
        return this.repository.getPostById(PostId.create(id));
    }
}
