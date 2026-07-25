import type { Slug } from '../domain/value-objects/Slug.valueObject'

export function postImageUrl(slug: Slug, width: number, height: number): string {
  return `https://picsum.photos/seed/${slug.toString()}/${width}/${height}`
}
