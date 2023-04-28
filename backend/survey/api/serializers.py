from rest_framework import serializers

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


class SurveyPublicResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = SurveyResult
        fields = "__all__"
