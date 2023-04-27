<template>
    <div id="surveyElement" style="display: inline-block; width: 100%;">
        <survey params="survey: model"></survey>
    </div>
</template>
<script>
import "survey-core/survey.i18n";
import { applyBindings } from "knockout";
import { SurveyModel } from "survey-knockout-ui";
import 'survey-core/defaultV2.min.css';
import store from "@/store";
import {Survey} from "@/apps/survey/models"
const $survey = new Survey()

export default {
  name: "SurveyPublic",
  props: ["id"],
  data() {
    return {
      user_uuid: null
    }
  },
  async mounted(){
    const survey_response = await $survey.get_public(this.id)
    const survey = new SurveyModel(survey_response.data);
    console.log(survey);
    survey.onComplete.add((sender, options) => {
        this.save_survey(sender.data)
    });
    applyBindings({
        model: survey
    }, document.getElementById("surveyElement"));
  },
  methods:{
    async save_survey(data){
      await $survey.result.post_public({"survey": this.id, data})
    }
  }
}

</script>