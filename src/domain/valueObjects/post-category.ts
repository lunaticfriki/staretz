export const VALID_CATEGORIES = [
    'music',
    'videogames',
    'programming',
    'literature',
    'philosophy',
    'watches',
    'tech',
] as const;

export type CategoryType = (typeof VALID_CATEGORIES)[number];

export class PostCategory {
    private readonly value: CategoryType;

    constructor(value: string) {
        if (!VALID_CATEGORIES.includes(value as CategoryType)) {
            throw new Error(
                `Invalid category: ${value}. Must be one of ${VALID_CATEGORIES.join(', ')}`,
            );
        }
        this.value = value as CategoryType;
    }

    getValue(): CategoryType {
        return this.value;
    }

    equals(other: PostCategory): boolean {
        return this.value === other.getValue();
    }
}
