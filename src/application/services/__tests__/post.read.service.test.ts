import { expect, test, describe, beforeEach } from 'vitest';
import { mock, instance, when, verify } from 'ts-mockito';
import { PostReadService } from '../post.read.service';
import { PostStateService } from '../post.state.service';
import type { PostRepository } from '../../../domain/repositories/post.repository';
import { Post } from '../../../domain/entities/post';
import { PostId } from '../../../domain/valueObjects/post-id';
import { PostTitle } from '../../../domain/valueObjects/post-title';
import { PostContent } from '../../../domain/valueObjects/post-content';
import { PostImage } from '../../../domain/valueObjects/post-image';

describe('PostReadService', () => {
    let mockRepository: PostRepository;
    let mockStateService: PostStateService;
    let postReadService: PostReadService;

    beforeEach(() => {
        mockRepository = mock<PostRepository>();
        mockStateService = mock(PostStateService);
        postReadService = new PostReadService(
            instance(mockRepository),
            instance(mockStateService),
        );
    });

    test('should fetch posts from repository and update state', async () => {
        const dummyPosts = [
            Post.create(
                PostId.create('1'),
                PostTitle.create('Title 1'),
                PostContent.create('Content 1'),
                PostImage.create('https://picsum.photos/400'),
            ),
        ];

        when(mockRepository.getPosts()).thenResolve(dummyPosts);

        await postReadService.execute();

        verify(mockRepository.getPosts()).once();
        verify(mockStateService.setPosts(dummyPosts)).once();
    });
});
