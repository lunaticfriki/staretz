export class PostDate {
    private constructor(public readonly value: Date) {}
    public static create(value: Date): PostDate {
        return new PostDate(value);
    }
}
