from rest_framework import serializers
from rest_framework.exceptions import ValidationError


from ..models import SurveyResult, Survey


class SurveyShowSerializer(serializers.ModelSerializer):

    class Meta:
        model = Survey
        fields = "__all__"


class SurveyListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Survey
        exclude = ['data']


class SurveyCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Survey
        fields = "__all__"


class SurveyResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = SurveyResult
        fields = "__all__"


class SurveyPublicResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = SurveyResult
        fields = "__all__"

    def validate_survey(self, value: Survey):
        if not value.status in [Survey.STATUS_ACTIVE]:
            ValidationError({"survey": "Опрос не активный"})
        return value
    