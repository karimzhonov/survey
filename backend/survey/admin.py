from typing import Any, Tuple
from django.contrib import admin
from django.db.models.query import QuerySet
from django.http.request import HttpRequest

from . import models


@admin.register(models.Survey)
class SurveyAdmin(admin.ModelAdmin):
    list_filter = ["status"]


@admin.register(models.SurveyResult)
class SurveyResultAdmin(admin.ModelAdmin):
    list_filter = ["survey"]
    search_fields = ["survey__name"]
    
    def get_search_results(self, request: HttpRequest, queryset: QuerySet[Any], search_term: str) -> Tuple[QuerySet[Any], bool]:
        if not search_term:
            return queryset, True
        ids = []
        for results in queryset:
            if any(search in results.data.values() for search in search_term.split(",")):
                ids.append(results.id)
        return queryset.filter(id__in=ids), True
