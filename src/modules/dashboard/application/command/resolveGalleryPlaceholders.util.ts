const GALLERY_PLACEHOLDER_PATTERN = /gallery:(\d+)/g

export function resolveGalleryPlaceholders(content: string, uploadedGalleryUrls: string[]): string {
  return content.replace(GALLERY_PLACEHOLDER_PATTERN, (placeholder, indexText) => {
    const url = uploadedGalleryUrls[Number(indexText)]
    return url ?? placeholder
  })
}
