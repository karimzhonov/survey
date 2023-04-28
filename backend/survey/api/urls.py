from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("survey", views.SurveyView, "")
router.register("survey/(?P<survey_id>[0-9A-Fa-f-]+)/result", views.SurveyResultView, "")
router.register("survey-public", views.SurveyPublicView, "")
router.register("survey-public/(?P<survey_id>[0-9A-Fa-f-]+)/result", views.SurveyPublicResultView, "")

urlpatterns = [
    path("", include(router.urls)),
]