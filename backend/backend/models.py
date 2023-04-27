from django.db import models
from parler.models import TranslatableModel, TranslatedFields


class Period(TranslatableModel):
    translations = TranslatedFields(
        name = models.CharField('Название', max_length=255)
    )
    from_date = models.DateField("Дата начало")
    to_date = models.DateField("Дата конец")
    filter_date = models.DateField("Дата для филтирация")

    def __str__(self) -> str:
        return self.get_translation('ru').name
    
    class Meta:
        verbose_name = 'Квартал'
        verbose_name_plural = 'Кварталы'
