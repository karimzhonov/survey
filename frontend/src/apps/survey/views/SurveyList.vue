<template>
    <div class="card m-5">
        <Toolbar class="mb-4">
            <template #start>
                <Button :label="$t('Новый Опрос')" icon="pi pi-plus" class="p-button p-button-success" @click="openNew" />
            </template>
        </Toolbar>
        <DataTable ref="dt" :value="surveys" showGridlines :responsiveLayout="'stack'">
            <Column field="title" :header="$t('Название')">
                <template #body="slotProps">
                    <p class="cursor-pointer" @click="async () => await row_click(slotProps.data.id)">{{ $t(slotProps.data.name) }}</p>
                </template>
            </Column>
            <Column style="width: 50px" field="delete_button" :header="$t('')">
                <template #body="slotProps">
                    <Button class="p-button p-button-danger" icon="pi pi-trash" @click="deleteSurveysDialog = true;survey=slotProps.data" />
                </template>
            </Column>
        </DataTable>

    </div>
    <Dialog v-model:visible="deleteSurveysDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>{{ $t("confirm_delete_surveys") }}</span>
            </div>
            <template #footer>
                <Button :label="$t('Нет')" icon="pi pi-times" text @click="deleteSurveysDialog = false"/>
                <Button :label="$t('Да')" icon="pi pi-check" text @click="() => deleteSelectedSurveys(this.survey.id)" />
            </template>
        </Dialog>
</template>
<script>
import { Survey } from '../models';
const $survey = new Survey()

export default {
    name: "SurveyList",
    data() {
        return {
            survey: {},
            surveys: [],
            surveys_params: {},
            selectedSurveys: [],
            deleteSurveysDialog: false
        }
    },
    methods: {
        async row_click(id) {
            await this.$router.push({"name": "survey_datail", params: {id}})
        },
        async openNew(){
            const new_surwey = await $survey.post({})
            await this.row_click(new_surwey.id)
        },
        async deleteSelectedSurveys(id) {
            await $survey.delete(id)
            this.deleteSurveysDialog = false
            this.surveys = await $survey.list(this.surveys_params)
        }
    },
    async mounted() {
        this.surveys = await $survey.list(this.surveys_params)
    }
}
</script>