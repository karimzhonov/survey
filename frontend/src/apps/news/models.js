import { ReadOnlyViewset } from "@/utils";


export class News extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/news/new/"
    }
}