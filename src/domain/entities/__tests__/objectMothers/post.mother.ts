import { Post } from '../../post';
import { PostId } from '../../../valueObjects/post-id';
import { PostTitle } from '../../../valueObjects/post-title';
import { PostContent } from '../../../valueObjects/post-content';

export class PostMother {
    static createRandom(): Post {
        return Post.create(
            PostId.create('random-id'),
            PostTitle.create('random-title'),
            PostContent.create('random-content'),
        );
    }

    static createWithData(data: {
        id: string;
        title: string;
        content: string;
    }): Post {
        return Post.create(
            PostId.create(data.id),
            PostTitle.create(data.title),
            PostContent.create(data.content),
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
        );
    }

    static createWithContent(content: string): Post {
        return Post.create(
            PostId.create('random-id'),
            PostTitle.create('random-title'),
            PostContent.create(content),
        );
    }

    static createWithId(id: string): Post {
        return Post.create(
            PostId.create(id),
            PostTitle.create('random-title'),
            PostContent.create('random-content'),
        );
    }

    static createWithTitleAndContent(title: string, content: string): Post {
        return Post.create(
            PostId.create('random-id'),
            PostTitle.create(title),
            PostContent.create(content),
        );
    }

    static createWithTitleAndId(title: string, id: string): Post {
        return Post.create(
            PostId.create(id),
            PostTitle.create(title),
            PostContent.create('random-content'),
        );
    }

    static createWithContentAndId(content: string, id: string): Post {
        return Post.create(
            PostId.create(id),
            PostTitle.create('random-title'),
            PostContent.create(content),
        );
    }
}
