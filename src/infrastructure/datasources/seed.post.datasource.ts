import 'reflect-metadata';
import { injectable } from 'inversify';
import { Post } from '../../domain/entities/post';
import { PostId } from '../../domain/valueObjects/post-id';
import { PostTitle } from '../../domain/valueObjects/post-title';
import { PostContent } from '../../domain/valueObjects/post-content';
import { PostImage } from '../../domain/valueObjects/post-image';
import type { PostDatasource } from '../../domain/datasources/post.datasource';

@injectable()
export class SeedPostDatasource implements PostDatasource {
    async getPosts(): Promise<Post[]> {
        const posts: Post[] = [];
        for (let i = 1; i <= 20; i++) {
            posts.push(
                Post.create(
                    PostId.create(`post-${i}`),
                    PostTitle.create(`Post Title ${i}`),
                    PostContent.create(
                        `This is the content for post ${i}. It is a dummy content generated for the seed.`,
                    ),
                    PostImage.create(`https://picsum.photos/seed/${i}/400/300`),
                ),
            );
        }
        return posts;
    }
}
