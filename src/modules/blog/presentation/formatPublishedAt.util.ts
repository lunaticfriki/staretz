import type { PublishedAt } from '../domain/value-objects/PublishedAt.valueObject'

export function formatPublishedAt(publishedAt: PublishedAt): string {
  return publishedAt.toDate().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
