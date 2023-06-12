<template>
  <div v-if="loading" class="layout-main row justify-content-center">
        <div class="col">
            <ProgressSpinner style="top:30%; left:47%"/>
        </div>
    </div>
  <div v-if="!loading">
    <div class="flex justify-content-end"><Button @click="() => creator.saveSurveyFunc(true, true)"></Button></div>
    <div id="surveyCreator"></div>
  </div>
</template>

<script>
import "survey-core/survey.i18n";
import 'survey-core/defaultV2.min.css';
import "survey-creator-core/survey-creator-core.min.css";
import "survey-creator-core/survey-creator-core.i18n";
import { SurveyCreator } from "survey-creator-knockout";
import { localization } from "survey-creator-core";
import { surveyLocalization } from 'survey-core';
import { Survey } from "../models";
import store from "@/store";
const $survey = new Survey()

const creatorOptions = {
  showLogicTab: true,
  isAutoSave: true,
  showTranslationTab: true,
  showDefaultLanguageInPreviewTab: "all",
  showDesignerTab: true,
};

export default {
    name: 'SurveyDetail',
    props: ["id"],
    data() {
      return {creator: {}}
    },
    async mounted() { 
        this.setup_locale()
        const survey_data = await $survey.get(this.id)
        const creator = new SurveyCreator(creatorOptions);
        creator.JSON = survey_data.data
        creator.saveSurveyFunc = async (saveNo, callback) => {
          await this.save_survey(creator.JSON)
          callback(saveNo, true)
        }
        creator.render("surveyCreator");
        this.creator = creator
        store.commit("basic", {key: 'loading', value: false})
    },
    computed: {
      loading: store.state.loading
    },
    methods: {
      setup_locale() {
        surveyLocalization.supportedLocales = ["ru", "uz-cl", "uz"];
        surveyLocalization.localeNames = ["Русский ", "Узбекискый кирилица", "Узбекискый латиница"];
        localization.currentLocale = this.$i18n.locale
        const translations = localization.getLocale("ru");
      },
      async save_survey(data) {        
        const rdata = {data}
        if (data.title) {
          rdata.name = data.title.default ?? (typeof data.title === "string" ? data.title : Object.values(data.title)[0])
        }
        await $survey.patch(this.id, rdata)
      }
    }
}
</script>

<style >
#surveyCreator {
  height: calc(100vh - 5rem - 5px);
  width: 100vw;
}
.svc-creator__banner {
  display: none!important;
}
</style>