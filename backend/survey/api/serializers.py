from rest_framework import serializers

from ..models import SurveyResult, Survey


class SurveyShowSerializer(serializers.ModelSerializer):

    class Meta:
        model = Survey
        fields = "__all__"


class SurveyCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Survey
        fields = "__all__"


class SurveyPublicResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = SurveyResult
        fields = "__all__"
