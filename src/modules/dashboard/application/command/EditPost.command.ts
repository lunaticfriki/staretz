export class EditPostCommand {
  constructor(
    readonly slug: string,
    readonly title: string,
    readonly excerpt: string,
    readonly content: string,
    readonly author: string,
    readonly category: string,
    readonly publishedAt: string,
    readonly currentImage: string,
    readonly imageFile: File | null,
    readonly keptGalleryUrls: string[] = [],
    readonly newGalleryFiles: File[] = [],
  ) {}
}
