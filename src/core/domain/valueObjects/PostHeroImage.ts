export class PostHeroImage {
    private constructor(public readonly value: string) {}
    public static create(value: string): PostHeroImage {
        return new PostHeroImage(value);
    }
}
