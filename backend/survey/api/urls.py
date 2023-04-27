from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("survey", views.SurveyView, "")
router.register("survey-result", views.SurveyResultView, "")

urlpatterns = [
    path("", include(router.urls)),
    path("survey-public/<pk>/", views.SurveyPublicView.as_view()),
    path("survey-public-result/", views.SurveyPublicResultView.as_view())
]