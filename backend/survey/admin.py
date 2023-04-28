from django.contrib import admin

from . import models


@admin.register(models.Survey)
class SurveyAdmin(admin.ModelAdmin):
    list_filter = ["status"]


@admin.register(models.SurveyResult)
class SurveyResultAdmin(admin.ModelAdmin):
    list_filter = ["survey"]
