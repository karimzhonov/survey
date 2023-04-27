from contrib.jet.dashboard.yandex_metrics.modules import (
    YandexMetrikaVisitorsChart, YandexMetrikaVisitorsTotals)
from django.utils.translation import gettext_lazy as _

from jet.dashboard import modules
from jet.dashboard.dashboard import AppIndexDashboard, Dashboard


class IndexDashboard(Dashboard):
    columns = 2
    def init_with_context(self, context):
        if context['request'].user.is_superuser:
            self.available_children.append(YandexMetrikaVisitorsTotals)
            self.available_children.append(YandexMetrikaVisitorsChart)
        self.available_children.append(modules.AppList)
        self.available_children.append(modules.ModelList)
        self.available_children.append(modules.RecentActions)   


class AppIndexDashboard(AppIndexDashboard):
    def init_with_context(self, context):
        self.available_children.append(modules.LinkList)
        self.children.append(modules.ModelList(
            title=_('Application models'),
            models=self.models(),
            column=0,
            order=0
        ))
        self.available_children.append(modules.RecentActions)

        if self.app_label == 'forecast':
            from forecast.dashboard import ForecastLineDashboard
            self.columns = 1
            self.available_children.append(ForecastLineDashboard)
