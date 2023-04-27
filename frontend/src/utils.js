import axios from "./plugins/axios"

export class ReadOnlyViewset {
    base_url = null
    constructor(kwargs) {
        this.kwargs = kwargs
    }
    async _collect_base_url() {
        let _base_url = JSON.parse(JSON.stringify(this.base_url))
        for (let key in this.kwargs) {
            _base_url = _base_url.replaceAll(`{${key}}`, this.kwargs[key])
        }
        return _base_url
    }
    async list(params) {
        const url = await this._collect_base_url()
        const response = await axios.get(url, {params})
        return response.data
    }

    async get(pk, params) {
        const url = `${await this._collect_base_url()}${pk}/`
        const response = await axios.get(url, {params})
        return response.data
    }

    async _request(method, ...kwargs) {
        return await axios[method](...kwargs)
    }

}

export class CRUD extends ReadOnlyViewset {
    async post(data, params) {
        const url = await this._collect_base_url()
        const response = await axios.post(url, data, {params})
        return response.data
    }
    
    async patch(pk, data, params) {
        const url = `${await this._collect_base_url()}${pk}/`
        const response = await axios.patch(url, data, {params})
        return response.data
    }
    async delete(pk, params) {
        const url = `${await this._collect_base_url()}${pk}/`
        const response = await axios.delete(url, {params})
        return response.data
    }
}


async function _refactor_translate_chart(data) {
    for (let d of data) {
        if (d.period) {
            d.id = d.period.id
            d.translations = d.period.translations
        }
        if (d.category) {
            d.id = d.category.id
            d.translations = d.category.translations
        }
    }
    return data
}


export async function translate_chart(data, lang) {
    data.labels = await _refactor_translate_chart(data.labels)
    data.datasets = await _refactor_translate_chart(data.datasets)
    data.labels = data.labels.reduce((a, v) => [...a, v.translations[lang].name], [])
    data.datasets = data.datasets.reduce((a, v) => {
        v.name = v.translations[lang].name
        a.push(v)
        return a
    }, [])
    return data
}
