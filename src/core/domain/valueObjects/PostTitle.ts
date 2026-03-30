export class PostTitle {
    private constructor(public readonly value: string) {}
    public static create(value: string): PostTitle {
        return new PostTitle(value);
    }
}
