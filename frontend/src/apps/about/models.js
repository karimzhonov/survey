import { ReadOnlyViewset } from "@/utils"


export class Personal extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/about/personal/"
    }
}
