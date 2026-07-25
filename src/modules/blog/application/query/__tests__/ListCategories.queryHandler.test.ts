import { describe, expect, it } from 'vitest'
import { instance, mock, when } from 'ts-mockito'
import { PostCollection } from '../../../domain/collections/Post.collection'
import { PostMother } from '../../../domain/entities/__tests__/Post.mother'
import type { PostRepository } from '../../../domain/repositories/Post.repository'
import { ListCategoriesQuery } from '../ListCategories.query'
import { ListCategoriesQueryHandler } from '../ListCategories.queryHandler'

describe('ListCategoriesQueryHandler', () => {
  it('returns the distinct categories across all posts', async () => {
    const repository = mock<PostRepository>()
    when(repository.findAll()).thenResolve(
      PostCollection.create([
        PostMother.category('Testing'),
        PostMother.category('Architecture'),
        PostMother.category('Testing'),
      ]),
    )

    const handler = new ListCategoriesQueryHandler(instance(repository))
    const categories = await handler.handle(new ListCategoriesQuery())

    expect(categories.toArray().map((category) => category.toString())).toEqual(['Architecture', 'Testing'])
  })
})
