import { PostDate } from "../valueObjects/PostDate";
import { PostDescription } from "../valueObjects/PostDescription";
import { PostHeroImage } from "../valueObjects/PostHeroImage";
import { PostId } from "../valueObjects/PostId";
import { PostTitle } from "../valueObjects/PostTitle";

export class Post {
    private constructor(
        public readonly id: PostId,
        public readonly title: PostTitle,
        public readonly description: PostDescription,
        public readonly date: PostDate,
        public readonly heroImage?: PostHeroImage,
    ) {}

    public static create(
        id: PostId,
        title: PostTitle,
        description: PostDescription,
        date: PostDate,
        heroImage?: PostHeroImage
    ): Post {
        return new Post(id, title, description, date, heroImage);
    }

    public static empty(): Post {
        return new Post(
            PostId.create("empty"),
            PostTitle.create(""),
            PostDescription.create(""),
            PostDate.create(new Date()),
            undefined
        );
    }
}
