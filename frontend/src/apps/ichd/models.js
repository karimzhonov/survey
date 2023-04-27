import axios from "@/plugins/axios";
import { ReadOnlyViewset, translate_chart } from "@/utils";


export class Upload extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/ichd/uploads/"
    }
}


export class Criteria extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/ichd/criteria/"
    }
}


export class Category extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/ichd/category/"
    }
}


export class PrimeryTable extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/ichd/primery-table/"
    }
}


export class RegionPrimeryTable extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/ichd/region-primery-table/"
    }
}


export class RegionSectorPrimeryTable extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/ichd/region-sector-primery-table/"
    }
}


export class AreaCategory extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = `/api/ichd/area-category/`
    }
}


export class Area extends ReadOnlyViewset {
    table = new PrimeryTable()
    category = new AreaCategory()

    constructor() {
        super()
        this.base_url = "/api/ichd/area/"
    }
    async bar(area_id, params, lang) {
        const url = `/api/ichd/area/${area_id}/bar/`
        const response = await axios.get(url, {params})
        return translate_chart(response.data, lang)
    }
    async line_chart(area_id, params, lang){
        const url = `/api/ichd/area/${area_id}/line-chart/`
        const response = await axios.get(url, {params})
        return translate_chart(response.data, lang)
    }
}


export class RegionCategory extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = `/api/ichd/region-category/`
    }
}


export class Region extends ReadOnlyViewset {
    category = new RegionCategory()
    table = new RegionPrimeryTable()

    constructor(){
        super()
        this.base_url = "/api/ichd/region/"
    }
    async line_chart(region_id, params, lang){
        const url = `/api/ichd/region/${region_id}/line-chart/`
        const response = await axios.get(url, {params})
        return translate_chart(response.data, lang)
    }

    async bar_all(params, lang) {
        const url = `/api/ichd/all-region-bar/`
        const response = await axios.get(url, {params})
        return translate_chart(response.data, lang)
    }
}


export class SectorCategory extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = `/api/ichd/sector-category/`
    }
}


export class Sector extends ReadOnlyViewset {
    category = new SectorCategory()

    constructor() {
        super()
        this.base_url = "/api/ichd/sector/"
    }

    async line_chart(sector_id, params, lang){
        const url = `/api/ichd/sector/${sector_id}/line-chart/`
        const response = await axios.get(url, {params})
        return translate_chart(response.data, lang)
    }
}

export class RegionSectorCategory extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = `/api/ichd/region-sector-category/`
    }
}


export class RegionSector extends ReadOnlyViewset {
    category = new RegionSectorCategory()
    table = new RegionSectorPrimeryTable()

    constructor() {
        super()
        this.base_url = "/api/ichd/region-sector/"
    }

    async line_chart(region_id, sector_id, params, lang){
        const url = `/api/ichd/region/${region_id}/sector/${sector_id}/line-chart/`
        const response = await axios.get(url, {params})
        return translate_chart(response.data, lang)
    }
    async bar(region_id, sector_id, params, lang) {
        const url = `/api/ichd/region/${region_id}/sector/${sector_id}/bar/`
        const response = await axios.get(url, {params})
        return translate_chart(response.data, lang)
    }
}


export class CriteriaUploadsDataTable extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/ichd/criteria-uploads/data-table/"
    }
}


export class CriteriaUploadsColumn extends ReadOnlyViewset {
    constructor() {
        super()
        this.base_url = "/api/ichd/criteria-uploads/column/"
    }
}


export class CriteriaUploads {
    data_table = new CriteriaUploadsDataTable()
    column = new CriteriaUploadsColumn()
}


export class ICHD {
    upload = new Upload()
    criteria = new Criteria()
    category = new Category()
    area = new Area()
    region = new Region()
    sector = new Sector()
    region_sector = new RegionSector()
    criteria_uploads = new CriteriaUploads()

    async home_city_data(params) {
        const response = await axios.get("/api/ichd/home-city-data/", {params})
        return response.data
    }

    async home_line_chart(params={}) {
        let table = await axios.get('/api/ichd/home-line-chart/', {params})
        table = table.data
        table.labels = table.labels.reduce((a, v) => [...a, v.period.to_date], [])
        table.datasets = table.datasets.reduce((a, v) => {
            v.name = v.translations[params.lang].name
            a.push(v)
            return a
        }, [])
        return table
    }
    async home_sectors_data(params={}){
        const table = await axios.get('/api/ichd/home-sector-chart/', {params})
        for (let sector of table.data) {
            sector.bar.labels = sector.bar.labels.reduce((a, v) => [...a, v.translations[params.lang].name], [])
            sector.bar.datasets = sector.bar.datasets.reduce((a, v) => {
                v.name = v.period.translations[params.lang].name
                a.push(v)
                return a
            }, [])
        }
        return table.data
    }
}


export class User {
    async get() {
        const url = "/api/ichd/user/"
        const response = await axios.get(url)
        return response.data
    }
}

export class UploaderExcel {
    async get_instance(params) {
        const url = "/api/ichd/parse-instance-xlsx/"
        const response = await axios.get(url, {params, responseType: "blob"})
        return response.data
    }

    async post_instance(data){
        const url = "/api/ichd/parse-xlsx/"
        const response = await axios.post(url, data)
        return response.data
    }

    async change(data) {
        const url = "/api/ichd/change-xlsx/"
        const response = await axios.patch(url, data)
        return response.data
    }
}


export class IchdUploader {
    user = new User()
    excel = new  UploaderExcel()
}
