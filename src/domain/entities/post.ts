import { PostId } from '../valueObjects/post-id';
import { PostTitle } from '../valueObjects/post-title';
import { PostContent } from '../valueObjects/post-content';
import { PostImage } from '../valueObjects/post-image';
import { PostCategory } from '../valueObjects/post-category';

export class Post {
    id: PostId;
    title: PostTitle;
    content: PostContent;
    image: PostImage;
    category: PostCategory;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;

    private constructor(
        id?: PostId,
        title?: PostTitle,
        content?: PostContent,
        image?: PostImage,
        category?: PostCategory,
    ) {
        this.id = id || PostId.create('temp-id');
        this.title = title || PostTitle.create('Untitled');
        this.content = content || PostContent.create('...');
        this.image =
            image ||
            PostImage.create('https://picsum.photos/seed/placeholder/400/300');
        this.category = category || new PostCategory('music');
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.publishedAt = new Date();
    }

    static create(
        id: PostId,
        title: PostTitle,
        content: PostContent,
        image: PostImage,
        category: PostCategory,
    ) {
        return new Post(id, title, content, image, category);
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

    updateCategory(category: PostCategory) {
        this.category = category;
        this.updatedAt = new Date();
    }

    publish() {
        this.publishedAt = new Date();
    }

    update(
        title: PostTitle,
        content: PostContent,
        image: PostImage,
        category: PostCategory,
    ) {
        this.title = title;
        this.content = content;
        this.image = image;
        this.category = category;
        this.updatedAt = new Date();
    }

    get value() {
        return {
            id: this.id.value,
            title: this.title.value,
            content: this.content.value,
            image: this.image.value,
            category: this.category.getValue(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            publishedAt: this.publishedAt,
            formattedDate: this.formattedDate,
        };
    }

    get formattedDate() {
        if (!this.publishedAt) return '';

        const day = String(this.publishedAt.getDate()).padStart(2, '0');
        const month = String(this.publishedAt.getMonth() + 1).padStart(2, '0');
        const year = this.publishedAt.getFullYear();

        return `${day}/${month}/${year}`;
    }
}
