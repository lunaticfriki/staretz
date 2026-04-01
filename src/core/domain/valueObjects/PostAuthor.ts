export class PostAuthor {
    private constructor(public readonly value: string) {}
    public static create(value: string): PostAuthor {
        return new PostAuthor(value);
    }
}
