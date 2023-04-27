from uuid import uuid4
from django.db import models
from django.contrib.auth import get_user_model
from parler.models import TranslatableModel, TranslatedFields

User = get_user_model()

class Survey(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    name = models.CharField(max_length=255, blank=True, null=True, default="Опрос")
    data = models.JSONField(default=dict)
    user = models.ForeignKey(User, models.CASCADE)


class SurveyResult(models.Model):
    data = models.JSONField(default=dict)
    survey = models.ForeignKey(Survey, models.CASCADE)
