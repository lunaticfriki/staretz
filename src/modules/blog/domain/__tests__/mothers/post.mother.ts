import { Post } from "../../entities/post";
import { faker } from "@faker-js/faker";

import { AuthorMother } from "./author.vo.mother";
import { Author } from "../../valueObjects/author.vo";


export class PostMother {
    public static createWithData(
        id: string,
        title: string,
        content: string,
        createdAt: Date,
        updatedAt: Date,
        image: string,
        author: Author,
    ){
        return Post.create(id, title, content, createdAt, updatedAt, image, author)
    }

    public static createEmpty(){
        return Post.create('', '', '', new Date(), new Date(), '', AuthorMother.createEmpty())
    }

    public static createRandom(){
        return Post.create(
            faker.string.uuid(),
            faker.lorem.sentence(),
            faker.lorem.paragraph(),
            faker.date.past(),
            faker.date.recent(),
            faker.image.url(),
            AuthorMother.createRandom(),
        )
    }
}