export class PostId {
    private constructor(public readonly value: string) {}
    public static create(value: string): PostId {
        return new PostId(value);
    }
}
