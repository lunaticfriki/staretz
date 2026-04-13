import { PostDate } from "../valueObjects/PostDate";
import { PostDescription } from "../valueObjects/PostDescription";
import { PostHeroImage } from "../valueObjects/PostHeroImage";
import { PostId } from "../valueObjects/PostId";
import { PostTitle } from "../valueObjects/PostTitle";
import { PostAuthor } from "../valueObjects/PostAuthor";
import { PostReadingTime } from "../valueObjects/PostReadingTime";

export class Post {
    private constructor(
        public readonly id: PostId,
        public readonly title: PostTitle,
        public readonly description: PostDescription,
        public readonly date: PostDate,
        public readonly author: PostAuthor,
        public readonly readingTime: PostReadingTime,
        public readonly heroImage?: PostHeroImage,
    ) {}

    public static create(
        id: PostId,
        title: PostTitle,
        description: PostDescription,
        date: PostDate,
        author: PostAuthor,
        readingTime: PostReadingTime,
        heroImage?: PostHeroImage
    ): Post {
        return new Post(id, title, description, date, author, readingTime, heroImage);
    }

    public static empty(): Post {
        return new Post(
            PostId.create("empty"),
            PostTitle.create(""),
            PostDescription.create(""),
            PostDate.create(new Date()),
            PostAuthor.create(""),
            PostReadingTime.empty(),
            undefined
        );
    }
}
