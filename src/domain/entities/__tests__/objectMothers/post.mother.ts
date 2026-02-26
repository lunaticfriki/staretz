import { Post } from '../../post';
import { PostId } from '../../../valueObjects/post-id';
import { PostTitle } from '../../../valueObjects/post-title';
import { PostContent } from '../../../valueObjects/post-content';
import { PostImage } from '../../../valueObjects/post-image';
import { PostCategory } from '../../../valueObjects/post-category';

export class PostMother {
    static createRandom(): Post {
        return Post.create(
            PostId.create('random-id'),
            PostTitle.create('random-title'),
            PostContent.create('random-content'),
            PostImage.create('https://picsum.photos/seed/placeholder/400/300'),
            new PostCategory('music'),
        );
    }

    static createWithData(data: {
        id: string;
        title: string;
        content: string;
        image?: string;
        category?: string;
    }): Post {
        return Post.create(
            PostId.create(data.id),
            PostTitle.create(data.title),
            PostContent.create(data.content),
            PostImage.create(
                data.image || 'https://picsum.photos/seed/placeholder/400/300',
            ),
            new PostCategory(data.category || 'music'),
        );
    }

    static createEmpty(): Post {
        return Post.empty();
    }

    static createWithTitle(title: string): Post {
        return Post.create(
            PostId.create('random-id'),
            PostTitle.create(title),
            PostContent.create('random-content'),
            PostImage.create('https://picsum.photos/seed/placeholder/400/300'),
            new PostCategory('music'),
        );
    }

    static createWithContent(content: string): Post {
        return Post.create(
            PostId.create('random-id'),
            PostTitle.create('random-title'),
            PostContent.create(content),
            PostImage.create('https://picsum.photos/seed/placeholder/400/300'),
            new PostCategory('music'),
        );
    }

    static createWithId(id: string): Post {
        return Post.create(
            PostId.create(id),
            PostTitle.create('random-title'),
            PostContent.create('random-content'),
            PostImage.create('https://picsum.photos/seed/placeholder/400/300'),
            new PostCategory('music'),
        );
    }

    static createWithTitleAndContent(title: string, content: string): Post {
        return Post.create(
            PostId.create('random-id'),
            PostTitle.create(title),
            PostContent.create(content),
            PostImage.create('https://picsum.photos/seed/placeholder/400/300'),
            new PostCategory('music'),
        );
    }

    static createWithTitleAndId(title: string, id: string): Post {
        return Post.create(
            PostId.create(id),
            PostTitle.create(title),
            PostContent.create('random-content'),
            PostImage.create('https://picsum.photos/seed/placeholder/400/300'),
            new PostCategory('music'),
        );
    }

    static createWithContentAndId(content: string, id: string): Post {
        return Post.create(
            PostId.create(id),
            PostTitle.create('random-title'),
            PostContent.create(content),
            PostImage.create('https://picsum.photos/seed/placeholder/400/300'),
            new PostCategory('music'),
        );
    }
}
