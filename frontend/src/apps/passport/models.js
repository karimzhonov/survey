import { ReadOnlyViewset } from "@/utils";


export class RegionPassport extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/passport/data-table/"
    }
}

export class Upload extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/passport/upload/"
    }
}
