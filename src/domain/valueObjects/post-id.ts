export class PostId {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    static create(value: string): PostId {
        if (!value || value.trim().length === 0) {
            throw new Error('PostId cannot be empty');
        }
        return new PostId(value);
    }
}
