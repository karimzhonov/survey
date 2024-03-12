<template>
    <div v-if="survey_active" id="surveyElement" style="display: inline-block; width: 100%;">
      <h2 v-if="survey_response" class="survey-title">{{ survey_response.data.title ? survey_response.data.title[$i18n.locale] ?? survey_response.data.title.default : survey_response.name }}</h2>
        <survey params="survey: model"></survey>
        <div v-if="ended" class="sv-action__content flex justify-content-center mb-8">
          <input @click="start_again" type="button" :value="$t('Пройти опрос еще раз')" class="sd-btn sd-btn--action sd-navigation__complete-btn" :title="$t('Тестировать еще раз')">
        </div>
      <div v-if="!started" style="width: 100%; height: 80vh;" class="flex justify-content-center align-items-center">
        <Button :label="$t('Начать опрос')" @click="start_survey" style="background-color: #19B394; border: none; border-radius: 0;" class="pt-4 pb-4 pl-6 pr-6"></Button>
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
import {survey_locale_uz_cl, survey_locale_uz} from "@/locale"
import {Converter} from "showdown"

surveyLocalization.locales["uz-cl"] = survey_locale_uz_cl
const $survey = new Survey()

export default {
  name: "SurveyPublic",
  props: ["id"],
  data() {
    return {
      start_date: null,
      survey_active: true,
      ended: false,
      started: false,
      survey_response: null
    }
  },
  async mounted(){
    let survey_response = null
    try {
      survey_response = await $survey.public.get(this.id)
      this.survey_response = survey_response
    } catch (e) {
      console.log(e);
      this.survey_active = false
    }
  },
  methods:{
    async save_survey(data, options){
      try {
        const $result = new SurveyPublicResult({survey_id: this.id})
        await $result.post({"survey": this.id, data, start_date: this.start_date.toJSON()})
        this.ended = true
        options.showDataSavingSuccess()
      } catch (e) {
        options.showDataSavingError()   
      }
        
    },
    async start_again() {
      window.location.reload()
    },
    async start_survey() {
      this.start_date = new Date()
      this.started = true
      const survey = new SurveyModel(this.survey_response.data);
      survey.onComplete.add((sender, options) => {
        options.showDataSaving()
        this.save_survey(sender.data, options)
      })
      //Create showdown markdown converter
      var converter = new Converter();
      survey.onTextMarkdown.add(function(survey, options){
        //convert the markdown text to html
        var str = converter.makeHtml(options.text);
        //remove root paragraphs <p></p>
        str = str.substring(3);
        str = str.substring(0, str.length - 4);
        //set html
        options.html = str;
    });
      surveyLocalization.currentLocale = this.$i18n.locale
      survey.locale = this.$i18n.locale
      surveyLocalization.locales["uz-cl"] = survey_locale_uz_cl
      surveyLocalization.locales.uz = survey_locale_uz
      applyBindings({
          model: survey
      }, document.getElementById("surveyElement"));
    }
  }
}

</script>
<style>
.survey-title {
  font-size: calc(4 * var(--base-unit, 8px));
  font-weight: 700;
  line-height: calc(5 * var(--base-unit, 8px));
  color: var(--primary, #19b394);
  background-color: var(--background, #fff);
  border-top: 2px;
  border-bottom: 2px;
  border-color: var(--primary, #19b394);
  text-align: center;
  margin: 0;
  position: sticky;
  top: 70px;
  z-index: 10;
  padding-bottom: 20px;
}
.sd-title.sd-container-modern__title {
  padding-top: 0;
}
@media screen and (min-width: 769px) {
  .sd-header__text h3 {
    display: none;
  }
}

@media screen and (max-width: 769px) {
  .survey-title {
    display: none;
  }
}

.sd-progress.sd-body__progress.sd-body__progress--top {
  display: none;
}

</style>