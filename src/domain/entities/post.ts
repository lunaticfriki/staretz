import { PostId } from '../valueObjects/post-id';
import { PostTitle } from '../valueObjects/post-title';
import { PostContent } from '../valueObjects/post-content';
import { PostImage } from '../valueObjects/post-image';

export class Post {
    id: PostId;
    title: PostTitle;
    content: PostContent;
    image: PostImage;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;

    private constructor(
        id?: PostId,
        title?: PostTitle,
        content?: PostContent,
        image?: PostImage,
    ) {
        this.id = id || PostId.create('temp-id');
        this.title = title || PostTitle.create('Untitled');
        this.content = content || PostContent.create('...');
        this.image =
            image ||
            PostImage.create('https://picsum.photos/seed/placeholder/400/300');
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.publishedAt = new Date();
    }

    static create(
        id: PostId,
        title: PostTitle,
        content: PostContent,
        image: PostImage,
    ) {
        return new Post(id, title, content, image);
    }

    static empty() {
        return new Post();
    }

    updateTitle(title: PostTitle) {
        this.title = title;
        this.updatedAt = new Date();
    }

    updateContent(content: PostContent) {
        this.content = content;
        this.updatedAt = new Date();
    }

    updateImage(image: PostImage) {
        this.image = image;
        this.updatedAt = new Date();
    }

    publish() {
        this.publishedAt = new Date();
    }

    update(title: PostTitle, content: PostContent, image: PostImage) {
        this.title = title;
        this.content = content;
        this.image = image;
        this.updatedAt = new Date();
    }

    get value() {
        return {
            id: this.id.value,
            title: this.title.value,
            content: this.content.value,
            image: this.image.value,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            publishedAt: this.publishedAt,
        };
    }
}
