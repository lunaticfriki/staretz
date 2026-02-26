export class PostContent {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    static create(value: string): PostContent {
        if (!value || value.trim().length === 0) {
            throw new Error('PostContent cannot be empty');
        }
        return new PostContent(value);
    }
}
