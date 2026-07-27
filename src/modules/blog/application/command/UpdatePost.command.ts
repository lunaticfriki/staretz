export class UpdatePostCommand {
  constructor(
    readonly slug: string,
    readonly title: string,
    readonly excerpt: string,
    readonly content: string,
    readonly author: string,
    readonly category: string,
    readonly publishedAt: string,
    readonly image: string,
    readonly gallery: string[] = [],
  ) {}
}
