from django.apps import AppConfig


class BackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend'
    verbose_name = 'Основной'

    def ready(self) -> None:
        import jet.utils
        from contrib.jet.utils import get_app_list
        jet.utils.get_app_list = get_app_list
