import { ReadOnlyViewset } from "@/utils";


export class AreaData extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/map/area-data/"
    }
}

export class RegionData extends ReadOnlyViewset {
    constructor(){
        super()
        this.base_url = "/api/map/region-data/"
    }
}

export class KinderGarden extends ReadOnlyViewset {
    constructor(){
        super()
        this.base_url = '/api/map/kinder-garden/'
    }
}

export class Polyclinic extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = '/api/map/polyclinic/'
    }
}

export class BusStop extends ReadOnlyViewset {
    constructor() {
        super() 
        this.base_url = '/api/map/bus-stop/'
    }
}

export class School extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/map/school/"
    }
}

export class Shop extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/map/shop/"
    }
}

export class Apteka extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/map/apteka/"
    }
}

export class Map {
    area_data = new AreaData()
    region_data = new RegionData()
    kinder_garden = new KinderGarden()
    polyclinic = new Polyclinic()
    bus_stop = new BusStop()
    school = new School()
    shop = new Shop()
    apteka = new Apteka()
}
