from contrib.parler.admin import TranslatableAdmin
from django.contrib import admin

from .models import Period

admin.site.site_title = 'Опросник'
admin.site.site_header = 'Опросник'
admin.site.index_title = 'Dashboard'
admin.site.site_url = '/'

@admin.register(Period)
class PeriodAdmin(TranslatableAdmin):
    list_display = ['name', 'from_date', 'to_date']
    ordering = ['filter_date']
