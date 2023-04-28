from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import get_object_or_404
from .serializers import SurveyShowSerializer, SurveyCreateSerializer, SurveyPublicResultSerializer, SurveyListSerializer, SurveyResultSerializer
from ..models import Survey, SurveyResult


class SurveyView(ModelViewSet):

    def get_queryset(self):
        return Survey.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return SurveyShowSerializer
        if self.action in ['list']:
            return SurveyListSerializer
        return SurveyCreateSerializer
    
    def create(self, request, *args, **kwargs):
        request.data.update(user=request.user.id)
        return super().create(request, *args, **kwargs)


class SurveyResultView(ModelViewSet):
    http_method_names = ["get", "delete"]
    serializer_class = SurveyResultSerializer

    def get_queryset(self):
        return SurveyResult.objects.filter(survey_id=self.kwargs.get("survey_id"), survey__user=self.request.user)


class SurveyPublicView(ModelViewSet):
    http_method_names = ["get"]
    filter_backends = ()

    def get_serializer_class(self):
        return SurveyShowSerializer

    def get_authenticators(self):
        instance: Survey = get_object_or_404(Survey, id=self.kwargs.get('pk'))
        if instance.need_auth:
            return super().get_authenticators()
        return ()
    
    def get_permissions(self):
        instance: Survey = get_object_or_404(Survey, id=self.kwargs.get('pk'))
        if instance.need_auth:
            return super().get_permissions()
        return ()

    def get_queryset(self):
        return Survey.objects.filter(status__in=[Survey.STATUS_ACTIVE])


class SurveyPublicResultView(ModelViewSet):
    http_method_names = ["post"]
    serializer_class = SurveyPublicResultSerializer

    def get_authenticators(self):
        instance: Survey = get_object_or_404(Survey, id=self.kwargs.get('survey_id'))
        if instance.need_auth:
            return super().get_authenticators()
        return ()
    
    def get_permissions(self):
        instance: Survey = get_object_or_404(Survey, id=self.kwargs.get('survey_id'))
        if instance.need_auth:
            return super().get_permissions()
        return ()
