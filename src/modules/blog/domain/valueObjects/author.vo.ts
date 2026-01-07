export class Author {
    private constructor(public readonly name: string) {}

    public static create(name: string) {
        return new Author(name)
    }

    public static empty() {
        return new Author('')
    }
}