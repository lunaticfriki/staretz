import { getCollection, getEntry } from 'astro:content';
import { Post } from "../../domain/entities/Post";
import { PostDate } from "../../domain/valueObjects/PostDate";
import { PostDescription } from "../../domain/valueObjects/PostDescription";
import { PostHeroImage } from "../../domain/valueObjects/PostHeroImage";
import { PostId } from "../../domain/valueObjects/PostId";
import { PostTitle } from "../../domain/valueObjects/PostTitle";
import { PostRepositoryPort } from "../../application/ports/PostRepositoryPort";

export class AstroContentPostRepositoryAdapter implements PostRepositoryPort {
    private constructor() {}

    public static create(): AstroContentPostRepositoryAdapter {
        return new AstroContentPostRepositoryAdapter();
    }

    private mapToDomain(post: any): Post {
        return Post.create(
            PostId.create(post.id),
            PostTitle.create(post.data.title),
            PostDescription.create(post.data.description),
            PostDate.create(post.data.pubDate),
            post.data.heroImage ? PostHeroImage.create(post.data.heroImage) : undefined
        );
    }

    public async getAllPosts(): Promise<Post[]> {
        const posts = await getCollection('blog');
        return posts.map((post) => this.mapToDomain(post)).sort((a, b) => b.date.value.valueOf() - a.date.value.valueOf());
    }

    public async getPostById(id: PostId): Promise<Post | undefined> {
        const post = await getEntry('blog', id.value);
        if (!post) return undefined;
        return this.mapToDomain(post);
    }
}
