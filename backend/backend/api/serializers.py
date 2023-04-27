from parler_rest.serializers import (TranslatableModelSerializer,
                                     TranslatedFieldsField)
from rest_framework import serializers

from ..models import Period


class PeriodSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Period)
    class Meta:
        model = Period
        fields = "__all__"
        