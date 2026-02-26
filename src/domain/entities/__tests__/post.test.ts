import { Post } from '../post';
import { PostMother } from './objectMothers/post.mother';
import { PostTitle } from '../../valueObjects/post-title';
import { PostContent } from '../../valueObjects/post-content';

describe('Post entity test', () => {
    it('should create a post', () => {
        const post = PostMother.createRandom();
        expect(post).toBeInstanceOf(Post);
    });

    it('should update a post', () => {
        const post = PostMother.createRandom();
        post.updateTitle(PostTitle.create('new-title'));
        post.updateContent(PostContent.create('new-content'));

        expect(post.value).toEqual({
            id: 'random-id',
            title: 'new-title',
            content: 'new-content',
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            publishedAt: post.publishedAt,
        });
    });

    it('should publish a post', () => {
        const post = PostMother.createRandom();
        post.publish();

        expect(post.publishedAt).toBeInstanceOf(Date);
    });

    it('should create an empty post', () => {
        const post = PostMother.createEmpty();

        expect(post.value).toEqual({
            id: 'temp-id',
            title: 'Untitled',
            content: '...',
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            publishedAt: post.publishedAt,
        });
    });

    it('should create a post with title', () => {
        const post = PostMother.createWithTitle('new-title');

        expect(post.value).toEqual({
            id: 'random-id',
            title: 'new-title',
            content: 'random-content',
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            publishedAt: post.publishedAt,
        });
    });

    it('should create a post with content', () => {
        const post = PostMother.createWithContent('new-content');

        expect(post.value).toEqual({
            id: 'random-id',
            title: 'random-title',
            content: 'new-content',
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            publishedAt: post.publishedAt,
        });
    });

    it('should create a post with id', () => {
        const post = PostMother.createWithId('new-id');

        expect(post.value).toEqual({
            id: 'new-id',
            title: 'random-title',
            content: 'random-content',
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            publishedAt: post.publishedAt,
        });
    });

    it('should create a post with title and content', () => {
        const post = PostMother.createWithTitleAndContent(
            'new-title',
            'new-content',
        );

        expect(post.value).toEqual({
            id: 'random-id',
            title: 'new-title',
            content: 'new-content',
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            publishedAt: post.publishedAt,
        });
    });

    it('should create a post with title and id', () => {
        const post = PostMother.createWithTitleAndId('new-title', 'new-id');

        expect(post.value).toEqual({
            id: 'new-id',
            title: 'new-title',
            content: 'random-content',
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            publishedAt: post.publishedAt,
        });
    });

    it('should create a post with content and id', () => {
        const post = PostMother.createWithContentAndId('new-content', 'new-id');

        expect(post.value).toEqual({
            id: 'new-id',
            title: 'random-title',
            content: 'new-content',
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            publishedAt: post.publishedAt,
        });
    });
});
