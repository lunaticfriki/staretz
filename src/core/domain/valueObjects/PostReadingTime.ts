export class PostReadingTime {
    private constructor(public readonly value: number) {}

    public static create(content: string): PostReadingTime {
        const text = content.trim();
        if (!text) {
            return new PostReadingTime(1);
        }
        
        const wordCount = text.split(/\s+/).length;
        const wordsPerMinute = 200;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        
        return new PostReadingTime(readingTime);
    }

    public static empty(): PostReadingTime {
        return new PostReadingTime(1);
    }
}
