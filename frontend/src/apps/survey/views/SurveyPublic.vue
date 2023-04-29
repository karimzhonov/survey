<template>
    <div v-if="survey_active" id="surveyElement" style="display: inline-block; width: 100%;">
        <survey params="survey: model"></survey>
        <div v-if="ended" class="sv-action__content flex justify-content-center">
          <input @click="start_again" type="button" :value="$t('Тестировать еще раз')" class="sd-btn sd-btn--action sd-navigation__complete-btn" :title="$t('Тестировать еще раз')">
        </div>
    </div>
    <div v-if="!survey_active" class="card">
      <h2 class="text-center">{{ $t("Опрос не активный или завершен") }}</h2>
    </div>
</template>
<script>
import "survey-core/survey.i18n";
import { applyBindings } from "knockout";
import {surveyLocalization } from "survey-core"
import { SurveyModel } from "survey-knockout-ui";
import 'survey-core/defaultV2.min.css';
import {Survey, SurveyPublicResult} from "@/apps/survey/models"
import {survey_locale_uz_cl} from "@/locale"
surveyLocalization.locales["uz-cl"] = survey_locale_uz_cl
const $survey = new Survey()

export default {
  name: "SurveyPublic",
  props: ["id"],
  data() {
    return {
      survey_active: true,
      ended: false
    }
  },
  async mounted(){
    let survey_response = null
    try {
      survey_response = await $survey.public.get(this.id)
    } catch (e) {
      console.log(e);
      this.survey_active = false
    }
    if (this.survey_active) {
      const survey = new SurveyModel(survey_response.data);
      survey.onComplete.add((sender, options) => {
          this.ended = true
          this.save_survey(sender.data)
      })
      surveyLocalization.currentLocale = this.$i18n.locale
      survey.locale = this.$i18n.locale
      surveyLocalization.locales["uz-cl"] = survey_locale_uz_cl
      applyBindings({
          model: survey
      }, document.getElementById("surveyElement"));
    }
  },
  methods:{
    async save_survey(data){
      const $result = new SurveyPublicResult({survey_id: this.id})
      await $result.post({"survey": this.id, data})
    },
    async start_again() {
      window.location.reload()
    }
  }
}

</script>