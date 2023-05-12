from uuid import uuid4
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Survey(models.Model):
    STATUS_DRAFT = "draft"
    STATUS_ACTIVE = "active"
    STATUS_PAUSE = "pause"
    STATUS_FINISHED = "finished"
    STATUS_CLOSED = "closed"
    STATUS = (
        (STATUS_DRAFT, "Черновик"),
        (STATUS_ACTIVE, "Активный"),
        (STATUS_PAUSE, "На паузе"),
        (STATUS_FINISHED, "Завершенные"),
        (STATUS_CLOSED, "Закрытые"),
    )

    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    name = models.CharField(max_length=255, blank=True, null=True, default="Опрос")
    data = models.JSONField(default=dict)
    user = models.ForeignKey(User, models.CASCADE)
    status = models.CharField(default=STATUS_DRAFT, choices=STATUS, max_length=20)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(blank=True, null=True)
    need_auth = models.BooleanField(default=False)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return self.name


class SurveyResult(models.Model):
    data = models.JSONField(default=dict)
    survey = models.ForeignKey(Survey, models.CASCADE)
    date = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        ordering = ["id"]
    