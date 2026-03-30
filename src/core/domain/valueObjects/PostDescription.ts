export class PostDescription {
    private constructor(public readonly value: string) {}
    public static create(value: string): PostDescription {
        return new PostDescription(value);
    }
}
