import { Post } from "../../domain/entities/Post";
import { PostId } from "../../domain/valueObjects/PostId";

export abstract class PostRepositoryPort {
    abstract getAllPosts(): Promise<Post[]>;
    abstract getPostById(id: PostId): Promise<Post | undefined>;
}
