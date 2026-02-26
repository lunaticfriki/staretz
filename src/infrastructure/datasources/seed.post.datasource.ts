import 'reflect-metadata';
import { injectable } from 'inversify';
import { Post } from '../../domain/entities/post';
import { PostId } from '../../domain/valueObjects/post-id';
import { PostTitle } from '../../domain/valueObjects/post-title';
import { PostContent } from '../../domain/valueObjects/post-content';
import { PostImage } from '../../domain/valueObjects/post-image';
import {
    PostCategory,
    VALID_CATEGORIES,
} from '../../domain/valueObjects/post-category';
import type { PostDatasource } from '../../domain/datasources/post.datasource';

@injectable()
export class SeedPostDatasource implements PostDatasource {
    async getPosts(): Promise<Post[]> {
        const posts: Post[] = [];
        // Distribute approximately evenly across the 7 categories
        for (let i = 1; i <= 21; i++) {
            const catIndex = i % VALID_CATEGORIES.length;
            const category = VALID_CATEGORIES[catIndex];

            posts.push(
                Post.create(
                    PostId.create(`post-${i}`),
                    PostTitle.create(`Post Title ${i}`),
                    PostContent.create(
                        `This is the content for post ${i}. It belongs to the ${category} category.`,
                    ),
                    PostImage.create(`https://picsum.photos/seed/${i}/400/300`),
                    new PostCategory(category),
                ),
            );
        }
        return posts;
    }
}
