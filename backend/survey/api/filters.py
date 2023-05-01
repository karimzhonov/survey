import django_filters.rest_framework as filters
from ..models import Survey, SurveyResult


class SurveyFilter(filters.FilterSet):
    status = filters.BaseInFilter(method="filter_status")

    class Meta:
        model = Survey
        fields = ["status"]

    def filter_status(self, queryset, name, value:list):
        if "all" in value:
            value = dict(Survey.STATUS).keys()
        return queryset.filter(status__in=value)


class SurveyResultFilter(filters.FilterSet):
    date__lte = filters.DateTimeFilter("date", "lte")
    date__gte = filters.DateTimeFilter("date", "gte")

    class Meta:
        model = SurveyResult
        fields = ["date__lte", "date__gte"]
    