export class PostImage {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    static create(value: string): PostImage {
        if (!value || value.trim().length === 0) {
            throw new Error('PostImage URL cannot be empty');
        }
        return new PostImage(value);
    }
}
