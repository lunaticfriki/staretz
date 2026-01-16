import { describe, it, expect } from 'vitest';
import { MarkdownPostMapper } from '../markdownPost.mapper';
import { Post } from '../../domain/entities/post';

describe('MarkdownPostMapper', () => {
  it('should parse valid markdown with frontmatter', () => {
    const raw = `---
id: test-post
title: Test Post
date: 2024-01-01
author: John Doe
tags: [tag1, tag2]
topic: Tech
---
# Hello World
This is a test post.
`;

    const post = MarkdownPostMapper.toDomain(raw);

    expect(post).toBeInstanceOf(Post);
    expect(post?.id).toBe('test-post');
    expect(post?.title).toBe('Test Post');
    expect(post?.tags).toEqual(['tag1', 'tag2']);
    expect(post?.topic).toBe('Tech');
  });

  it('should handle comma separated tags', () => {
    const raw = `---
id: test-post
title: Test Post
date: 2024-01-01
author: John Doe
tags: tag1, tag2, tag3
topic: Tech
---
Content
`;

    const post = MarkdownPostMapper.toDomain(raw);
    expect(post?.tags).toEqual(['tag1', 'tag2', 'tag3']);
  });

  it('should default tags to empty array and topic to General', () => {
    const raw = `---
id: test-post
title: Test Post
date: 2024-01-01
author: John Doe
---
Content
`;

    const post = MarkdownPostMapper.toDomain(raw);
    expect(post?.tags).toEqual([]);
    expect(post?.topic).toBe('General');
  });

  it('should handle quoted strings in frontmatter', () => {
    const raw = `---
id: "test-post"
title: "Test Post"
date: "2024-01-01"
author: "John Doe"
topic: "Tech"
---
Content
`;
    const post = MarkdownPostMapper.toDomain(raw);
    expect(post?.id).toBe('test-post');
    expect(post?.title).toBe('Test Post');
    expect(post?.topic).toBe('Tech');
  });
});
