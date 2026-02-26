export class PostTitle {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    static create(value: string): PostTitle {
        if (!value || value.trim().length === 0) {
            throw new Error('PostTitle cannot be empty');
        }
        if (value.length > 255) {
            throw new Error('PostTitle cannot exceed 255 characters');
        }
        return new PostTitle(value);
    }
}
