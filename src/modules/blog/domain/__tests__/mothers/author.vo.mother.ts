import { faker } from "@faker-js/faker"
import { Author } from "../../valueObjects/author.vo"

export class AuthorMother {
    public static createWithData(name: string){
        return Author.create(name)
    }

    public static createEmpty(){
        return Author.create('')
    }

    public static createRandom(){
        return Author.create(faker.person.firstName())
    }
}