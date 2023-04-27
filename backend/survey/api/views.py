from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from .serializers import SurveyShowSerializer, SurveyCreateSerializer, SurveyPublicResultSerializer
from ..models import Survey, SurveyResult


class SurveyView(ModelViewSet):

    def get_queryset(self):
        return Survey.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action in ["list", 'retrieve']:
            return SurveyShowSerializer
        return SurveyCreateSerializer
    
    def create(self, request, *args, **kwargs):
        request.data.update(user=request.user.id)
        return super().create(request, *args, **kwargs)


class SurveyResultView(ModelViewSet):
    http_method_names = ["get", "delete"]
    serializer_class = SurveyPublicResultSerializer

    def get_queryset(self):
        return SurveyResult.objects.filter(survey_id=self.kwargs.get("survey_id"), user=self.request.user)


class SurveyPublicView(RetrieveAPIView):
    permission_classes = ()
    authentication_classes = ()
    serializer_class = SurveyShowSerializer
    def get_queryset(self):
        return Survey.objects.all()


class SurveyPublicResultView(CreateAPIView):
    serializer_class = SurveyPublicResultSerializer
    permission_classes = ()
    authentication_classes = ()
