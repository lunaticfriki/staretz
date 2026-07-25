export function postImagePlaceholderUrl(seed: string, width = 1200, height = 800): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}
