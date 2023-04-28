import { CRUD } from "@/utils";
import axios from "@/plugins/axios";

export class SurveyResult extends CRUD {
    constructor(kwargs) {
        super(kwargs)
        this.base_url = "/api/survey/survey/{survey_id}/result/"
    }

    async post_public(data, params) {
        const url = "/api/survey/survey-public-result/"
        const response = await axios.post(url, data, {params})
        return response.data
    }
}

export class Survey extends CRUD {
    result = new SurveyResult()
    constructor() {
        super()
        this.base_url = "/api/survey/survey/"
    }

    async get_public(pk, params) {
        const url = `/api/survey/survey-public/${pk}/`
        const response = await axios.get(url, {params})
        return response.data
    }
}