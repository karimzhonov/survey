import { CRUD } from "@/utils";

export class SurveyResult extends CRUD {
    constructor(kwargs) {
        super(kwargs)
        this.base_url = "/api/survey/survey/{survey_id}/result/"
    }
}

export class SurveyPublicResult extends CRUD {
    constructor(kwargs) {
        super(kwargs)
        this.base_url = "/api/survey/survey-public/{survey_id}/result/"
    }
}

export class SurveyPublic extends CRUD {
    constructor(kwargs) {
        super(kwargs)
        this.base_url = "/api/survey/survey-public/"
    }
} 

export class Survey extends CRUD {
    public = new SurveyPublic()

    constructor() {
        super()
        this.base_url = "/api/survey/survey/"
    }
}