from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.generics import get_object_or_404
from django.utils import timezone
from django.db.models import Q
from .filters import SurveyFilter, SurveyResultFilter
from .serializers import SurveyShowSerializer, SurveyCreateSerializer, SurveyPublicResultSerializer, SurveyListSerializer, SurveyResultSerializer
from ..models import Survey, SurveyResult


class SurveyView(ModelViewSet):
    filterset_class = SurveyFilter

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Survey.objects.all()
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
    
    def perform_destroy(self, instance):
        instance.status = Survey.STATUS_CLOSED
        instance.save()


class SurveyResultView(ModelViewSet):
    http_method_names = ["get", "delete"]
    serializer_class = SurveyResultSerializer
    filterset_class = SurveyResultFilter

    def get_queryset(self):
        qs = SurveyResult.objects.filter(survey_id=self.kwargs.get("survey_id"))
        if self.request.user.is_superuser:
            return qs
        return qs.filter(survey__user=self.request.user)


class SurveyPublicView(ReadOnlyModelViewSet):
    filter_backends = ()

    def get_serializer_class(self):
        return SurveyShowSerializer

    def get_authenticators(self):
        if self.kwargs.get('pk'):
            instance: Survey = get_object_or_404(Survey, id=self.kwargs.get('pk'))
            if instance.need_auth:
                return super().get_authenticators()
        return ()
    
    def get_permissions(self):
        if self.kwargs.get('pk'):
            instance: Survey = get_object_or_404(Survey, id=self.kwargs.get('pk'))
            if instance.need_auth:
                return super().get_permissions()
        return ()

    def get_queryset(self):
        return Survey.objects.filter(Q(end_date__gte=timezone.now()) | Q(end_date__isnull=True), status__in=[Survey.STATUS_ACTIVE], start_date__lte=timezone.now())


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
