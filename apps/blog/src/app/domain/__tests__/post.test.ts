import { PostMother } from './mothers/post.mother';

describe('Post domain tests', () => {
  it('should create a post', () => {
    const post = PostMother.createRandom();
    expect(post).toBeDefined();
  });
  it('should create empty post', () => {
    const post = PostMother.createEmpty();
    expect(post).toBeDefined();
  });
  it('should update a post', () => {
    const post = PostMother.createRandom();
    const updatedPost = PostMother.createRandom();
    post.update({
      title: updatedPost.getValue().title,
      content: updatedPost.getValue().content,
      image: updatedPost.getValue().image,
    });
    expect(post.getValue().title).toBe(updatedPost.getValue().title);
    expect(post.getValue().content).toBe(updatedPost.getValue().content);
    expect(post.getValue().image).toBe(updatedPost.getValue().image);
  });

  it('should return if a post is equal to another post', () => {
    const post = PostMother.createRandom();
    const post2 = PostMother.createRandom();

    expect(post.equals(post2)).not.toBeTruthy();

    const postWithData1 = PostMother.createWithData({
      id: '1',
      title: 'title',
      content: 'content',
      image: 'image',
    });
    const postWithData2 = PostMother.createWithData({
      id: '1',
      title: 'title',
      content: 'content',
      image: 'image',
    });
    expect(postWithData1.equals(postWithData2)).toBeTruthy();
  });
});
