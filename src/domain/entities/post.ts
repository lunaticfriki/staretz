import { PostId } from '../valueObjects/post-id';
import { PostTitle } from '../valueObjects/post-title';
import { PostContent } from '../valueObjects/post-content';

export class Post {
    id: PostId;
    title: PostTitle;
    content: PostContent;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;

    private constructor(id?: PostId, title?: PostTitle, content?: PostContent) {
        this.id = id || PostId.create('temp-id');
        this.title = title || PostTitle.create('Untitled');
        this.content = content || PostContent.create('...');
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.publishedAt = new Date();
    }

    static create(id: PostId, title: PostTitle, content: PostContent) {
        return new Post(id, title, content);
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

    publish() {
        this.publishedAt = new Date();
    }

    update(title: PostTitle, content: PostContent) {
        this.title = title;
        this.content = content;
        this.updatedAt = new Date();
    }

    get value() {
        return {
            id: this.id.value,
            title: this.title.value,
            content: this.content.value,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            publishedAt: this.publishedAt,
        };
    }
}
