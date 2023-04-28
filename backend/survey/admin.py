from django.contrib import admin

from . import models


@admin.register(models.Survey)
class SurveyAdmin(admin.ModelAdmin):
    pass


@admin.register(models.SurveyResult)
class SurveyResultAdmin(models.SurveyResult):
    pass
